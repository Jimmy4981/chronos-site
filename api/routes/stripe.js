// api/routes/stripe.js
import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import { CosmosClient } from '@azure/cosmos';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
});

// --- Initialize CosmosDB client & container ---
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key:      process.env.COSMOS_KEY
});
// ensure database + container exist
const { database }  = await cosmosClient.databases.createIfNotExists({ id: 'TenantDB' });
const { container } = await database.containers.createIfNotExists({ id: 'Tenants' });

// GET /api/stripe/checkout
router.get('/checkout', async (req, res) => {
  console.log('📥  /api/stripe/checkout hit, query:', req.query);
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).send({ error: 'Missing tenantId' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url:  process.env.STRIPE_CANCEL_URL,
    metadata: { tenantId }
  });

  console.log('🛒 Created Checkout Session:', {
    id: session.id,
    mode: session.mode,
    url: session.url,
    metadata: session.metadata
  });

  res.json({ url: session.url });
});

// POST /api/stripe/webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),  // raw body is required for signature check
  async (req, res) => {
    console.log('📬  Stripe webhook received, signature:', req.headers['stripe-signature']);
    const sig = req.headers['stripe-signature'];
    let evt;
    try {
      evt = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object;
      console.log('✅  checkout.session.completed for tenant:', session.metadata.tenantId);
      const tenantId = session.metadata.tenantId;

      // Retrieve full subscription to get trial_end, etc.
      const subscription = await stripe.subscriptions.retrieve(session.subscription);

      // Upsert billing info into Cosmos
      const { resource: tenantDoc } = await container.item(tenantId, tenantId).read();
      tenantDoc.billing = {
        stripeCustomerId: session.customer,
        subscriptionId:  session.subscription,
        plan:            'pro',
        trialEnds:       subscription.trial_end * 1000
      };
      await container.items.upsert(tenantDoc);
      console.log(`✅ Billing updated for tenant ${tenantId}`);
    }

    // Return a 200 to acknowledge receipt of the event
    res.json({ received: true });
  }
);

export default router;
