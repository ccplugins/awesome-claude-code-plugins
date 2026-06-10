---
name: difesa-attacchi
description: Aggiunge a un sito/app un agente di difesa che rileva e blocca richieste malevole (SQL injection, XSS, path traversal, brute force, bot) con rate limiting, blocklist IP e modalità lockdown che chiude il sistema preservando i dati. Trigger - "blocca attacchi", "anti-attacco", "firewall", "WAF", "lockdown", "difendi il sito", "rate limiting", "sotto attacco".
---

# Difesa Attacchi (agente guardian)

Quando l'utente vuole protezione attiva dagli attacchi, integrare nel progetto il middleware "guardian". Il codice pronto è in `references/guardian-express.js` (Node/Express); per altri stack (Flask/Django, PHP) adattare la stessa logica.

## Cosa fa il guardian
1. **Rilevamento pattern malevoli** su URL, query, body e header: SQL injection, XSS, path traversal, command injection, scanner noti.
2. **Rate limiting** per IP (generale + più severo su login/pagamenti).
3. **Blocklist automatica**: un IP che supera la soglia di richieste malevole viene bloccato temporaneamente, con escalation se recidivo.
4. **Modalità lockdown**: se gli eventi malevoli superano la soglia globale, il sito entra in stato di chiusura controllata — risponde 503 con pagina di manutenzione, blocca ogni scrittura, mantiene i dati intatti e (se configurato) esegue un backup e invia un alert.
5. **Logging strutturato** di ogni evento in `security-events.log` per analisi successiva.

## Come integrarlo (Express)
```js
const { guardian } = require('./security/guardian');
app.use(guardian({
  rateLimit: { windowMs: 60000, max: 120 },
  strictPaths: ['/login', '/api/auth', '/api/pay'],   // limite 10/min
  lockdown: { threshold: 50, windowMs: 300000, unlockAfterMs: 900000 },
  onAlert: async (evento) => { /* email/webhook all'amministratore */ },
  onLockdown: async () => { /* backup DB, notifica */ }
}));
```
Montarlo PRIMA delle route. Copiare `references/guardian-express.js` in `security/guardian.js` nel progetto e adattare le soglie.

## Regole di implementazione
- Il guardian è una difesa in profondità, NON sostituisce query parametrizzate, validazione e hardening (skill hardening-siti): applicare comunque quelle regole.
- Dietro proxy/CDN ricavare l'IP reale da `X-Forwarded-For` solo se il proxy è fidato (`app.set('trust proxy', 1)`).
- Il lockdown NON deve mai cancellare dati: solo bloccare l'accesso in scrittura e servire la pagina di manutenzione. Lo sblocco è automatico dopo il timeout o manuale (file flag `LOCKDOWN` rimovibile / variabile env).
- Escludere dai controlli i webhook di pagamento verificati con firma (altrimenti payload legittimi possono sembrare sospetti) — la sicurezza lì è la firma (skill privacy-pagamenti).
- Consigliare SEMPRE anche una protezione a livello di piattaforma (Cloudflare/WAF dell'hosting): il middleware difende l'applicazione, non assorbe DDoS volumetrici.

## Risposta agli incidenti
In caso di attacco rilevato suggerire all'utente: 1) esaminare `security-events.log`, 2) ruotare le chiavi/segreti se c'è sospetto di compromissione, 3) verificare integrità dati con il backup, 4) mantenere il lockdown finché la falla non è chiusa.