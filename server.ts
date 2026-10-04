import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './src/server/app.js';
import { config } from './src/server/config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createApp();
  const PORT = config.port;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[ShopSphere] Vite middleware mounted in development mode');
  } else {
    // Production mode: Serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[ShopSphere] Serving production build from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================================`);
    console.log(`🛒 ShopSphere Server running at http://0.0.0.0:${PORT}`);
    console.log(`🚀 Mode: ${isProd ? 'Production' : 'Development'}`);
    console.log(`🔗 API Base: http://0.0.0.0:${PORT}/api`);
    console.log(`========================================================`);
  });
}

startServer().catch(err => {
  console.error('[ShopSphere] Failed to start server:', err);
  process.exit(1);
});
