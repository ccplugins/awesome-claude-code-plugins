---
description: Installa nel progetto corrente tutte le protezioni - middleware anti-attacco, security headers, file di sicurezza GitHub e hardening
---

Installa le protezioni di sicurezza nel progetto della cartella di lavoro corrente (se non c'è una cartella connessa, chiedila con request_cowork_directory). Prima rileva lo stack (Node/Express, Python, PHP, sito statico) guardando i file del progetto.

Applica nell'ordine:

1. **Agente anti-attacco** (skill difesa-attacchi): copia e adatta `guardian-express.js` in `security/guardian.js` e integralo nell'entry point dell'app. Per stack non-Node, riscrivi la stessa logica nel linguaggio del progetto. Configura `skipPaths` per eventuali webhook di pagamento.
2. **Security headers e hardening** (skill hardening-siti): aggiungi helmet/headers, correggi cookie, CORS e gestione errori dove necessario.
3. **File GitHub** (skill sicurezza-github): crea `.github/workflows/security.yml` e `.github/dependabot.yml` adattati al linguaggio del progetto; verifica `.gitignore`.
4. **Verifiche pagamenti e autenticazione**: se il progetto gestisce pagamenti o login, controlla i punti critici delle skill privacy-pagamenti e autenticazione-sicura e correggi ciò che è automatizzabile; segnala il resto.

Non rimuovere funzionalità esistenti; se una modifica rischia di rompere qualcosa, chiedi prima conferma all'utente con AskUserQuestion.

Alla fine presenta un riepilogo: cosa è stato installato, cosa deve fare l'utente sul suo hosting/GitHub (attivare secret scanning, push protection, WAF/CDN), e come si attiva/disattiva manualmente il lockdown (file flag LOCKDOWN).
