---
name: architettura-fortezza
description: Progetta e installa un'infrastruttura di sicurezza a 4 livelli dove il cuore (dati e chiavi) è offline e staccato, lo scudo è invisibile agli scanner e il server reale è nascosto. Usare quando l'utente vuole un sistema "chiuso in una scatola", un reverse proxy invisibile, un'alternativa self-hosted a Cloudflare, server nascosto, VPN WireGuard, o backup offline irraggiungibili. Trigger - "fortezza", "scatola chiusa", "offline", "invisibile", "nascosto", "mini cloudflare", "reverse proxy", "air gap", "cassaforte", "WireGuard".
---

# Architettura Fortezza (4 livelli)

Quando l'utente vuole un sistema "blindato" dove il cuore è staccato e lo scudo è
invisibile, proporre e installare questa architettura. I file template completi
(proxy guardian, Caddy, docker-compose, firewall, WireGuard, backup cifrati) sono
in `references/fortezza/` dentro questa skill; questa skill spiega come adattarli.

## Premessa onesta da dare SEMPRE all'utente
La porta web pubblica non può essere invisibile: se i visitatori la raggiungono,
la raggiunge anche chi attacca. Invisibili possono diventare invece SSH,
l'amministrazione, il server reale e la cassaforte. E i DDoS volumetrici enormi
restano gestibili solo con un CDN/WAF esterno (es. Cloudflare free) davanti allo
scudo. Non promettere "non attaccabile": promettere "superficie ridotta al minimo,
cuore irraggiungibile, dati sempre recuperabili".

## I quattro livelli

1. **Scudo invisibile** — unica macchina pubblica. Caddy (HTTPS + rimozione
   impronte) → proxy `guardian` (WAF, rate limit, blocklist silenziosa, lockdown,
   honeypot). Firewall stealth: solo 80/443 visibili, resto in DROP, niente ping.
2. **Server origine nascosto** — sito + DB, nessuna porta pubblica, accetta solo
   lo scudo via VPN. L'app ascolta sull'IP VPN, mai esposta dal provider.
3. **WireGuard** — rete privata cifrata tra scudo, origine e admin. Non risponde
   senza chiave valida → invisibile agli scanner. Solo gli `AllowedIPs` passano.
4. **Cassaforte offline** — air-gapped, custodisce la chiave privata. Backup
   cifrati con chiave pubblica (il server cifra ma non può decifrare). La
   cassaforte va a prendere i backup (sola andata); il server non la conosce.

## Principi di progettazione da rispettare
- **Minima superficie**: ogni livello espone solo ciò che serve al livello accanto.
- **Conoscenza parziale**: ogni macchina conosce solo il vicino, mai l'intera catena.
- **One-way verso il cuore**: nessun percorso che parta dal server e arrivi alla cassaforte.
- **Cifratura asimmetrica**: chi può essere compromesso (il server) ha solo la chiave pubblica.
- **Silenzio**: agli attaccanti non si risponde (stealth), per non dare impronte né feedback.
- **Difesa in profondità**: questa architettura si SOMMA alle altre skill del plugin
  (hardening-siti, difesa-attacchi, privacy-pagamenti, autenticazione-sicura), non le sostituisce.

## Installazione (ordine)
1. Cassaforte: generare le chiavi offline (`genera-chiavi.sh`).
2. WireGuard su scudo, origine, admin.
3. Origine: avviare app su IP VPN, poi `firewall-origine.sh`.
4. Scudo: configurare `ORIGIN_URL` e dominio, `docker compose up -d --build`, `firewall-stealth.sh`.
5. Backup: cron notturno di `backup-cifrato.sh` sull'origine; pull periodico dalla cassaforte.

## Verifica
Da macchina esterna `nmap -Pn IP_SCUDO`: solo 80/443. SSH/WireGuard invisibili.
Il server origine non deve rispondere. Provare un ripristino di backup sulla
cassaforte per confermare che la catena funziona.
