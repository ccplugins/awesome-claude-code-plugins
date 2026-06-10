---
name: hardening-siti
description: Applica regole di sicurezza (hardening) ogni volta che si costruisce, modifica o revisiona un sito web o un'app. Copre security headers, CSP, HTTPS, validazione input, cookie, CORS, upload, gestione errori e OWASP Top 10. Trigger - "crea un sito", "costruisci un'app", "metti in sicurezza", "proteggi il sito", "hardening", "security headers", "build a website".
---

# Hardening Siti

Quando si costruisce o si modifica un sito/app, applicare SEMPRE queste regole di sicurezza senza che l'utente debba chiederlo. Segnalare nel riepilogo finale quali protezioni sono state applicate.

## Regole obbligatorie

### 1. Security headers
Applicare su ogni risposta HTML:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

In Node/Express usare `helmet()`. In Django attivare `SECURE_*` settings. Su hosting statico (Netlify/Vercel/GitHub Pages) usare il file headers della piattaforma. Adattare la CSP alle risorse reali del sito (CDN, font, analytics) — mai usare `unsafe-inline` per gli script; preferire nonce o hash.

### 2. Input e output
- Validare OGNI input lato server (tipo, lunghezza, formato, whitelist). La validazione client è solo UX.
- Query al database SOLO parametrizzate o via ORM. Mai concatenare stringhe in SQL.
- Escapare l'output nei template (autoescaping attivo). Mai inserire input utente in `innerHTML`, `eval`, attributi evento o URL senza sanitizzazione.
- Path file: mai costruire percorsi da input utente; usare ID mappati o `path.basename` + directory fissa.

### 3. Cookie e sessioni
- Cookie di sessione: `HttpOnly; Secure; SameSite=Lax` (o `Strict` per azioni sensibili).
- Rigenerare l'ID sessione al login. Scadenza assoluta e per inattività.
- Protezione CSRF su ogni form/azione che modifica stato (token CSRF o SameSite + verifica Origin).

### 4. CORS
- Mai `Access-Control-Allow-Origin: *` su endpoint autenticati. Whitelist esplicita di origin.

### 5. Upload di file
- Whitelist di estensioni E content-type verificato sul contenuto reale (magic bytes).
- Rinominare i file con ID casuali, salvarli FUORI dalla web root o su storage separato, limitare la dimensione.

### 6. Errori e log
- Mai mostrare stack trace o dettagli interni all'utente; pagina di errore generica + log lato server.
- Loggare login, errori di autenticazione, pagamenti e azioni amministrative (senza dati sensibili nei log).

### 7. Segreti e dipendenze
- Mai chiavi/API key/password nel codice o nella repo: usare variabili d'ambiente e file `.env` in `.gitignore`.
- Generare sempre `.gitignore` con `.env`, `node_modules`, credenziali.
- Usare versioni aggiornate delle dipendenze; consigliare `npm audit` / `pip-audit` (vedi skill sicurezza-github per l'automazione).

### 8. HTTPS
- Tutto il traffico in HTTPS, redirect da HTTP, HSTS attivo. In sviluppo locale va bene HTTP ma documentare la differenza.

## Checklist finale
Prima di consegnare un sito/app, verificare: headers presenti, query parametrizzate, validazione server, cookie sicuri, CSRF, niente segreti nel codice, errori generici, `.gitignore` corretto. Elencare all'utente le protezioni applicate e gli eventuali punti che richiedono configurazione sul suo hosting.
