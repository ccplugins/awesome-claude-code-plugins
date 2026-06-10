/**
 * guardian-express.js — Agente di difesa applicativa per Express
 * Rileva richieste malevole, applica rate limiting, blocklist IP
 * e modalità lockdown che chiude il sistema preservando i dati.
 *
 * Uso:
 *   const { guardian } = require('./security/guardian');
 *   app.use(guardian({ ...opzioni }));
 */
const fs = require('fs');
const path = require('path');

const PATTERNS = [
  // SQL injection
  /(\b(union|select)\b[\s\S]{0,40}\b(from|sleep|benchmark)\b)|('\s*(or|and)\s+['\d])|(--\s*$)|(\bdrop\s+table\b)/i,
  // XSS
  /<script\b|javascript\s*:|on(error|load|click|mouseover)\s*=|<iframe\b|document\.(cookie|location)/i,
  // Path traversal / file disclosure
  /\.\.[\/\\]|\/etc\/passwd|\.env\b|web\.config|\.git\//i,
  // Command injection
  /[;&|`]\s*(cat|ls|rm|wget|curl|nc|bash|sh|powershell)\b/i,
];

const SCANNER_UA = /sqlmap|nikto|nmap|masscan|acunetix|nessus|dirbuster|gobuster|wpscan/i;

function defaults(opts = {}) {
  return {
    rateLimit: { windowMs: 60_000, max: 120, ...(opts.rateLimit || {}) },
    strictPaths: opts.strictPaths || ['/login', '/api/auth'],
    strictMax: opts.strictMax || 10,
    blockAfter: opts.blockAfter || 5,            // eventi malevoli per bloccare un IP
    blockMs: opts.blockMs || 3_600_000,          // 1h
    lockdown: { threshold: 50, windowMs: 300_000, unlockAfterMs: 900_000, ...(opts.lockdown || {}) },
    lockdownFlagFile: opts.lockdownFlagFile || path.join(process.cwd(), 'LOCKDOWN'),
    logFile: opts.logFile || path.join(process.cwd(), 'security-events.log'),
    skipPaths: opts.skipPaths || ['/webhook'],   // es. webhook con firma propria
    onAlert: opts.onAlert || null,
    onLockdown: opts.onLockdown || null,
  };
}

// decodeURIComponent lancia URIError su encoding malformato (es. /%E0%A4%A):
// senza try/catch un attaccante può appendere richieste o crashare il processo.
const safeDecode = (s) => { try { return decodeURIComponent(s); } catch (_) { return null; } };

function guardian(userOpts) {
  const opts = defaults(userOpts);
  const hits = new Map();      // ip -> timestamp richieste (rate limit)
  const offenses = new Map();  // ip -> { count, last }
  const blocked = new Map();   // ip -> sbloccoA
  let globalEvents = [];       // timestamp eventi malevoli (per lockdown)
  let lockdownUntil = 0;

  // Pulizia periodica: senza, le mappe crescono senza limite (esaurimento memoria)
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [k, arr] of hits) {
      const a = arr.filter(t => now - t < opts.rateLimit.windowMs);
      a.length ? hits.set(k, a) : hits.delete(k);
    }
    for (const [k, until] of blocked) if (now >= until) { blocked.delete(k); offenses.delete(k); }
    for (const [k, o] of offenses) if (o.last && now - o.last > opts.blockMs) offenses.delete(k);
  }, 60_000);
  if (sweep.unref) sweep.unref();

  const log = (entry) => {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';
    fs.appendFile(opts.logFile, line, () => {});
  };

  const inLockdown = () => Date.now() < lockdownUntil || fs.existsSync(opts.lockdownFlagFile);

  const triggerLockdown = async (reason) => {
    lockdownUntil = Date.now() + opts.lockdown.unlockAfterMs;
    try { fs.writeFileSync(opts.lockdownFlagFile, reason); } catch (_) {}
    log({ type: 'LOCKDOWN_ATTIVATO', reason });
    if (opts.onLockdown) { try { await opts.onLockdown(reason); } catch (_) {} }
  };

  const registerOffense = async (ip, req, matched) => {
    const ev = { type: 'RICHIESTA_MALEVOLA', ip, method: req.method, url: req.originalUrl, matched };
    log(ev);
    if (opts.onAlert) { try { await opts.onAlert(ev); } catch (_) {} }

    const o = offenses.get(ip) || { count: 0 };
    o.count += 1; o.last = Date.now();
    offenses.set(ip, o);
    if (o.count >= opts.blockAfter) {
      blocked.set(ip, Date.now() + opts.blockMs);
      log({ type: 'IP_BLOCCATO', ip, perMs: opts.blockMs });
    }

    const now = Date.now();
    globalEvents = globalEvents.filter(t => now - t < opts.lockdown.windowMs);
    globalEvents.push(now);
    if (globalEvents.length >= opts.lockdown.threshold && !inLockdown()) {
      await triggerLockdown(`soglia eventi superata (${globalEvents.length})`);
    }
  };

  const isMalicious = (req) => {
    const decoded = safeDecode(req.originalUrl || '');
    if (decoded === null) return 'uri-malformata'; // encoding rotto = tecnica di evasione
    const haystacks = [
      decoded,
      JSON.stringify(req.query || {}),
      typeof req.body === 'object' ? JSON.stringify(req.body || {}) : String(req.body || ''),
    ];
    for (const p of PATTERNS) for (const h of haystacks) if (p.test(h)) return p.source.slice(0, 40);
    if (SCANNER_UA.test(req.headers['user-agent'] || '')) return 'scanner-ua';
    return null;
  };

  return async function guardianMiddleware(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // 0. Lockdown: solo lettura pagina manutenzione, nessuna scrittura
    if (inLockdown()) {
      res.set('Retry-After', '900');
      return res.status(503).send('<h1>Manutenzione di sicurezza</h1><p>Il servizio tornerà disponibile a breve. I tuoi dati sono al sicuro.</p>');
    }

    // 1. IP bloccato
    const until = blocked.get(ip);
    if (until) {
      if (Date.now() < until) return res.status(403).send('Accesso negato.');
      blocked.delete(ip); offenses.delete(ip);
    }

    // 2. Percorsi esclusi (es. webhook verificati con firma propria)
    if (opts.skipPaths.some(p => req.path.startsWith(p))) return next();

    // 3. Rate limiting
    const now = Date.now();
    const arr = (hits.get(ip) || []).filter(t => now - t < opts.rateLimit.windowMs);
    arr.push(now); hits.set(ip, arr);
    const strict = opts.strictPaths.some(p => req.path.startsWith(p));
    if (arr.length > (strict ? opts.strictMax : opts.rateLimit.max)) {
      log({ type: 'RATE_LIMIT', ip, path: req.path });
      res.set('Retry-After', String(Math.ceil(opts.rateLimit.windowMs / 1000)));
      return res.status(429).send('Troppe richieste. Riprova più tardi.');
    }

    // 4. Rilevamento pattern malevoli
    const matched = isMalicious(req);
    if (matched) {
      await registerOffense(ip, req, matched);
      return res.status(403).send('Richiesta bloccata.');
    }

    next();
  };
}

module.exports = { guardian };
