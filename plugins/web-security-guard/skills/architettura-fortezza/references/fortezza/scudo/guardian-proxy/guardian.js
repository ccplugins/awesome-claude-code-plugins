/**
 * guardian.js — Agente di difesa (versione Fortezza, con modalità silenziosa)
 * Rileva richieste malevole, rate limiting, blocklist IP, lockdown.
 * silentMode: gli attaccanti non ricevono risposte — connessione chiusa.
 */
const fs = require('fs');
const path = require('path');

const PATTERNS = [
  /(\b(union|select)\b[\s\S]{0,40}\b(from|sleep|benchmark)\b)|('\s*(or|and)\s+['\d])|(--\s*$)|(\bdrop\s+table\b)/i,
  /<script\b|javascript\s*:|on(error|load|click|mouseover)\s*=|<iframe\b|document\.(cookie|location)/i,
  /\.\.[\/\\]|\/etc\/passwd|\.env\b|web\.config|\.git\//i,
  /[;&|`]\s*(cat|ls|rm|wget|curl|nc|bash|sh|powershell)\b/i,
];
const SCANNER_UA = /sqlmap|nikto|nmap|masscan|acunetix|nessus|dirbuster|gobuster|wpscan/i;
// Percorsi che esistono solo per chi cerca vulnerabilità: chi li tocca è ostile
const HONEYPOT = /^\/(wp-admin|wp-login\.php|phpmyadmin|\.env|admin\.php|xmlrpc\.php)/i;

function defaults(o = {}) {
  return {
    rateLimit: { windowMs: 60_000, max: 120, ...(o.rateLimit || {}) },
    strictPaths: o.strictPaths || ['/login'],
    strictMax: o.strictMax || 10,
    blockAfter: o.blockAfter || 3,
    blockMs: o.blockMs || 3_600_000,
    lockdown: { threshold: 50, windowMs: 300_000, unlockAfterMs: 900_000, ...(o.lockdown || {}) },
    lockdownFlagFile: o.lockdownFlagFile || path.join(process.cwd(), 'LOCKDOWN'),
    logFile: o.logFile || path.join(process.cwd(), 'security-events.log'),
    skipPaths: o.skipPaths || [],
    silentMode: o.silentMode !== false,
    onAlert: o.onAlert || null,
    onLockdown: o.onLockdown || null,
  };
}

// decodeURIComponent lancia URIError su encoding malformato (es. /%E0%A4%A):
// senza try/catch un attaccante può appendere richieste o crashare il processo.
const safeDecode = (s) => { try { return decodeURIComponent(s); } catch (_) { return null; } };

function guardian(userOpts) {
  const opts = defaults(userOpts);
  const hits = new Map(), offenses = new Map(), blocked = new Map();
  let globalEvents = [], lockdownUntil = 0;

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

  const log = (e) =>
    fs.appendFile(opts.logFile, JSON.stringify({ ts: new Date().toISOString(), ...e }) + '\n', () => {});
  const inLockdown = () => Date.now() < lockdownUntil || fs.existsSync(opts.lockdownFlagFile);
  const silence = (req, res) => { try { req.socket.destroy(); } catch (_) { res.end(); } };

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
    o.count += 1; o.last = Date.now(); offenses.set(ip, o);
    if (o.count >= opts.blockAfter) { blocked.set(ip, Date.now() + opts.blockMs); log({ type: 'IP_BLOCCATO', ip }); }
    const now = Date.now();
    globalEvents = globalEvents.filter(t => now - t < opts.lockdown.windowMs);
    globalEvents.push(now);
    if (globalEvents.length >= opts.lockdown.threshold && !inLockdown())
      await triggerLockdown(`soglia eventi superata (${globalEvents.length})`);
  };

  const isMalicious = (req) => {
    if (HONEYPOT.test(req.path)) return 'honeypot';
    const decoded = safeDecode(req.originalUrl || '');
    if (decoded === null) return 'uri-malformata'; // encoding rotto = tecnica di evasione
    const hay = [
      decoded,
      JSON.stringify(req.query || {}),
      typeof req.body === 'object' ? JSON.stringify(req.body || {}) : String(req.body || ''),
    ];
    for (const p of PATTERNS) for (const h of hay) if (p.test(h)) return p.source.slice(0, 40);
    if (SCANNER_UA.test(req.headers['user-agent'] || '')) return 'scanner-ua';
    return null;
  };

  return async function guardianMiddleware(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (inLockdown()) {
      res.set('Retry-After', '900');
      return res.status(503).send('<h1>Manutenzione</h1><p>Il servizio tornerà disponibile a breve. I dati sono al sicuro.</p>');
    }

    const until = blocked.get(ip);
    if (until) {
      if (Date.now() < until) return opts.silentMode ? silence(req, res) : res.status(403).end();
      blocked.delete(ip); offenses.delete(ip);
    }

    if (opts.skipPaths.some(p => req.path.startsWith(p))) return next();

    const now = Date.now();
    const arr = (hits.get(ip) || []).filter(t => now - t < opts.rateLimit.windowMs);
    arr.push(now); hits.set(ip, arr);
    const strict = opts.strictPaths.some(p => req.path.startsWith(p));
    if (arr.length > (strict ? opts.strictMax : opts.rateLimit.max)) {
      log({ type: 'RATE_LIMIT', ip, path: req.path });
      res.set('Retry-After', '60');
      return res.status(429).send('Troppe richieste.');
    }

    const matched = isMalicious(req);
    if (matched) {
      await registerOffense(ip, req, matched);
      return opts.silentMode ? silence(req, res) : res.status(403).end();
    }
    next();
  };
}

module.exports = { guardian };
