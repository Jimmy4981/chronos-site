// api/routes/config.js
import express from 'express';
import 'dotenv/config';
import { CosmosClient } from '@azure/cosmos';

const router = express.Router();

// 1) Initialize Cosmos client
const cosmos = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key:      process.env.COSMOS_KEY
});

// 2) Ensure DB + container exist (top‐level await)
const { database }  = await cosmos.databases.createIfNotExists({ id: 'TenantDB' });
const { container } = await database.containers.createIfNotExists({ id: 'Tenants' });

// 3) POST /api/config  – upsert the tenant document
router.post('/', async (req, res) => {
  const { tenantId, weeklyReportConfig } = req.body;
  if (!tenantId || !weeklyReportConfig) {
    return res.status(400).json({ error: 'Missing tenantId or weeklyReportConfig' });
  }

  const doc = {
    id:                tenantId,
    tenantId,
    weeklyReportConfig,
    billing: {}
  };

  try {
    const { resource } = await container.items.upsert(doc);
    return res.json(resource);
  } catch (err) {
    console.error('Error upserting config:', err);
    return res.status(500).json({ error: 'Failed to save config' });
  }
});

// 4) GET /api/config?tenantId=…  – read it back
router.get('/', async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: 'Missing tenantId' });
  }

  try {
    const { resource } = await container.item(tenantId, tenantId).read();
    return res.json(resource);
  } catch (err) {
    if (err.code === 404) {
      // no config yet
      return res.json({});
    }
    console.error('Error reading config:', err);
    return res.status(500).json({ error: 'Failed to fetch config' });
  }
});

export default router;
