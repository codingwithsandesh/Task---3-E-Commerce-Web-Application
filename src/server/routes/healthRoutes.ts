import { Router, Response } from 'express';
import { db } from '../db/index.js';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res: Response) => {
  const dbStatus = db.getSystemStatus();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ShopSphere API',
    version: '1.0.0',
    database: dbStatus,
  });
});
