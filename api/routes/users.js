// api/routes/users.js
import express from 'express';
import { CosmosClient } from '@azure/cosmos';

// Cosmos setup
const client       = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key:      process.env.COSMOS_KEY
});
const { database } = await client.databases.createIfNotExists({ id: 'TenantDB' });
const { container} = await database.containers.createIfNotExists({ id: 'Tenants' });

const router = express.Router();

// GET /api/users?tenantId=<>
router.get('/', async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: 'Missing tenantId' });

  const { resource } = await container.item(tenantId, tenantId).read();
  res.json(resource.users || []);
});

// POST /api/users
//   body: { tenantId, user: { aadId, displayName, email, roles } }
router.post('/', async (req, res) => {
  const { tenantId, user } = req.body;
  if (!tenantId || !user) return res.status(400).json({ error: 'Missing payload' });

  const { resource } = await container.item(tenantId, tenantId).read();
  resource.users = resource.users || [];
  resource.users.push(user);
  await container.items.upsert(resource);

  res.json(resource.users);
});

// PUT /api/users/roles
//   body: { tenantId, aadId, roles }
router.put('/roles', async (req, res) => {
  const { tenantId, aadId, roles } = req.body;
  if (!tenantId || !aadId || !Array.isArray(roles)) {
    console.log('❌  Invalid payload!');
    return res.status(400).json({ error: 'Missing payload' });
  }

  const { resource } = await container.item(tenantId, tenantId).read();
  resource.users = (resource.users || []).map(u =>
    u.aadId === aadId ? { ...u, roles } : u
  );
  await container.items.upsert(resource);

  res.json(resource.users);
});

export default router;
