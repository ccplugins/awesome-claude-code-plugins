/**
 * Scudo Fortezza — reverse proxy invisibile con agente guardian.
 * Tutto ciò che non è traffico web legittimo viene scartato in silenzio.
 *
 * Env richieste:
 *   ORIGIN_URL  -> es. http://10.0.0.2:3000  (server nascosto, IP privato)
 *   PORT        -> default 8080 (dietro Caddy)
 */
const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const { guardian } = require('./guardian');

const ORIGIN = process.env.ORIGIN_URL;
if (!ORIGIN) { console.error('ORIGIN_URL mancante'); process.exit(1); }

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Caddy davanti

// Corpo letto solo per l'ispezione del guardian (limite anti-abuso)
app.use(express.json({ limit: '100kb', strict: false }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// ── Invisibilità: niente risposte che rivelino il sistema ──
// Metodi non web: connessione chiusa senza risposta (per gli scanner = host morto)
app.use((req, res, next) => {
  const ok = ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  if (!ok.includes(req.method)) return req.socket.destroy();
  next();
});

// ── Agente guardian: WAF, rate limit, blocklist, lockdown ──
app.use(guardian({
  rateLimit: { windowMs: 60_000, max: 120 },
  strictPaths: ['/login', '/api/auth', '/api/pay'],
  lockdown: { threshold: 50, windowMs: 300_000, unlockAfterMs: 900_000 },
  skipPaths: ['/webhook'],
  // Invisibilità: gli offender non ricevono un 403 "parlante",
  // la connessione viene chiusa e basta (vedi silentMode in guardian.js)
  silentMode: true,
}));

// ── Proxy verso il server nascosto ──
app.use(createProxyMiddleware({
  target: ORIGIN,
  changeOrigin: true,
  xfwd: true,
  proxyTimeout: 30_000,
  on: {
    // Obbligatorio: express.json() ha già consumato lo stream del body;
    // senza fixRequestBody ogni POST/PUT con body resterebbe appesa in timeout.
    proxyReq: fixRequestBody,
    proxyRes: (proxyRes) => {
      // Rimuove ogni impronta del backend
      delete proxyRes.headers['server'];
      delete proxyRes.headers['x-powered-by'];
      delete proxyRes.headers['via'];
    },
    error: (_err, _req, res) => {
      if (res && !res.headersSent) { res.writeHead(502); res.end('Servizio non disponibile.'); }
    },
  },
}));

app.listen(process.env.PORT || 8080, () => console.log('Scudo attivo'));
