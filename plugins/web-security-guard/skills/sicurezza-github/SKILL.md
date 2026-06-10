---
name: sicurezza-github
description: Aggiunge alle repository GitHub dei siti workflow di sicurezza automatici - scansione dipendenze vulnerabili, ricerca di segreti/chiavi nel codice, analisi statica CodeQL e Dependabot. Trigger - "sicurezza repo", "GitHub Actions di sicurezza", "scansione repository", "metti la sicurezza nella repo", "dependabot", "secret scanning".
---

# Sicurezza GitHub

Quando un progetto ha (o avrà) una repository GitHub, installare i file di sicurezza nella directory `.github/` della repo. I template pronti sono in `references/`.

## File da installare nella repo

1. `.github/workflows/security.yml` — da `references/security-workflow.yml`: a ogni push/PR e ogni notte esegue scansione segreti (Gitleaks), audit dipendenze (npm/pip) e analisi statica CodeQL.
2. `.github/dependabot.yml` — da `references/dependabot.yml`: PR automatiche di aggiornamento per dipendenze vulnerabili.

Adattare al linguaggio del progetto: lasciare il job `npm audit` solo se c'è `package.json`, `pip-audit` solo se c'è `requirements.txt`/`pyproject.toml`, impostare i linguaggi CodeQL corretti (`javascript`, `python`, ecc.).

## Regole
- Verificare che `.gitignore` escluda `.env` e credenziali PRIMA del primo push. Se un segreto è già finito nella history, va considerato compromesso: ruotarlo subito (cambiare la chiave dal provider), non basta cancellare il file.
- Consigliare all'utente di attivare nelle impostazioni GitHub della repo: Secret scanning + Push protection, Dependabot alerts, branch protection sul branch principale (review obbligatoria, status check del workflow security).
- I workflow falliscono la build se trovano segreti o vulnerabilità high/critical: spiegare all'utente che è voluto.

## Limite da comunicare
Questi workflow proteggono il codice e le dipendenze, non bloccano gli attacchi al sito in esecuzione: per quello servono la skill difesa-attacchi (middleware) e un WAF/CDN davanti al sito.
