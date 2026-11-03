import { serve } from '@hono/node-server';
import { app } from './index';

const port = Number(process.env.PORT) || 3001;

console.log(`⚡ LedgerAI Hono Server starting on http://localhost:${port}/api ...`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`🚀 LedgerAI Hono Server running at http://localhost:${info.port}/api`);
});

