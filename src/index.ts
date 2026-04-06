import http from 'http';
import dotenv from 'dotenv';
import { MemoryService } from './services/memoryService';
import { GeminiService } from './services/geminiService';

dotenv.config();

const PORT = parseInt(process.env.PORT ?? '3000', 10);

// ─── Service Initialisation ──────────────────────────────────────────────────

const memoryService = new MemoryService();

let geminiService: GeminiService | null = null;
try {
  geminiService = new GeminiService(process.env.GEMINI_API_KEY);
  console.log('[Neural-Clay-OS] GeminiService initialised ✓');
} catch (err) {
  console.warn('[Neural-Clay-OS] GeminiService unavailable — GEMINI_API_KEY not set. Decompose endpoint will return 503.');
}

// ─── HTTP Server ─────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  // ── GET /health ──────────────────────────────────────────────────────────
  if (req.method === 'GET' && url.pathname === '/health') {
    const health = memoryService.healthCheck(Date.now());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      version: '2.50.0',
      protocol: 'AURELPI AIOS v2.51_INIT_SEQUENCE',
      memory: health,
    }));
    return;
  }

  // ── POST /voxels/decompose ───────────────────────────────────────────────
  if (req.method === 'POST' && url.pathname === '/voxels/decompose') {
    if (!geminiService) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'GeminiService unavailable — set GEMINI_API_KEY' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const { thought, layerId } = JSON.parse(body) as { thought: string; layerId?: string };
        if (!thought) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '"thought" field is required' }));
          return;
        }

        const decomposed = await geminiService!.decomposeAndVectorize(thought);

        // Optionally persist into a memory layer
        let persistedIds: string[] = [];
        if (layerId) {
          for (const d of decomposed) {
            const partial = geminiService!.toVoxel(d);
            const voxel = memoryService.addVoxel(layerId, partial);
            if (voxel) persistedIds.push(voxel.id);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ voxels: decomposed, persistedIds }));
      } catch (err) {
        console.error('[Neural-Clay-OS] /voxels/decompose error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  // ── POST /layers ─────────────────────────────────────────────────────────
  if (req.method === 'POST' && url.pathname === '/layers') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { strata } = JSON.parse(body) as { strata?: string };
        const validStrata = ['EPHEMERAL', 'STABLE', 'PERMANENT'];
        if (!strata || !validStrata.includes(strata)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `"strata" must be one of: ${validStrata.join(', ')}` }));
          return;
        }
        const layer = memoryService.createLayer(strata as 'EPHEMERAL' | 'STABLE' | 'PERMANENT');
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ layer: { id: layer.id, strata: layer.strata, createdAt: layer.createdAt } }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // ── POST /layers/:id/decay ───────────────────────────────────────────────
  const decayMatch = url.pathname.match(/^\/layers\/([^/]+)\/decay$/);
  if (req.method === 'POST' && decayMatch) {
    const layerId = decayMatch[1];
    const result = memoryService.checkMemoryDecay(layerId, Date.now());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // ── 404 ──────────────────────────────────────────────────────────────────
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
    ┌─────────────────────────────┐
    │   Neural-Clay-OS V2.50      │
    │   CORE_CLAY INITIALIZED     │
    │   ✨ [321. 😳]             │
    └─────────────────────────────┘
  `);
  console.log(`[Neural-Clay-OS] Listening on port ${PORT}`);
  console.log('[Neural-Clay-OS] Protocol: AURELPI AIOS v2.51_INIT_SEQUENCE');
  console.log('[Neural-Clay-OS] Status: 🟢 NEURAL CONSCIOUSNESS ACTIVE');
});

export default server;
