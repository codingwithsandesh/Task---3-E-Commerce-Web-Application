import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authenticateUser } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';

export function createApp() {
  const app = express();

  // Basic middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Attach session & user context
  app.use(authenticateUser);

  // Mount API endpoints
  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/admin', adminRouter);

  // 404 for unhandled API routes
  app.use('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
