# Fortezza — architettura a 4 livelli

Sistema di sicurezza "a scatole chiuse": il cuore (dati e chiavi) è staccato e
offline, lo scudo è invisibile agli scanner, e ogni livello conosce solo quello
immediatamente accanto. Un attaccante che superasse un livello non troverebbe il
successivo, perché non ne conosce nemmeno l'indirizzo.

## I quattro livelli

1. **Scudo invisibile** (`scudo/`) — l'unica macchina esposta a internet. Caddy
   gestisce HTTPS e nasconde ogni impronta del server; il proxy `guardian`
   filtra le richieste malevole, applica rate limiting, blocca gli IP ostili in
   silenzio (modalità stealth: niente risposte agli attaccanti) e attiva il
   lockdown sotto attacco. Il firewall (`firewall-stealth.sh`) lascia visibili
   solo le porte 80/443 e fa sparire tutto il resto.

2. **Server origine nascosto** (`origine/`) — il sito e il database reali. Non
   ha alcuna porta pubblica: accetta connessioni **solo dallo scudo**, e solo
   attraverso la VPN. Per il mondo esterno questa macchina non esiste.

3. **Corridoio invisibile WireGuard** (`vpn-wireguard/`) — la rete privata
   cifrata che collega scudo, origine e amministratore. WireGuard non risponde a
   chi non ha la chiave: agli scanner appare come nulla.

4. **Cassaforte offline** (`cassaforte/`) — il cuore. Macchina air-gapped che
   custodisce la chiave privata e i backup. È la cassaforte ad andare a prendere
   i backup (sola andata): il server non può raggiungerla né sa che esiste. I
   backup sono cifrati con la chiave pubblica, quindi il server può crearli ma
   non leggerli — solo la cassaforte può.

```
Internet ─▶ [Scudo: Caddy + guardian]  ──VPN──▶  [Origine: sito + DB]
                  (l'unico visibile)                      │ crea backup cifrati
                                                          ▼
                                          [Cassaforte OFFLINE]  ◀── va a prenderli (sola andata)
                                          chiave privata + ripristino
```

## Ordine di installazione

1. **Cassaforte** (offline): `bash cassaforte/genera-chiavi.sh` → ottieni chiave
   privata (resta qui) e pubblica (copiala sul server origine).
2. **WireGuard** su tutte e tre le macchine: segui `vpn-wireguard/README-wireguard.md`.
3. **Server origine**: avvia l'app sull'IP VPN, poi `sudo bash origine/firewall-origine.sh`.
4. **Scudo**: imposta `ORIGIN_URL` (IP VPN dell'origine) nel `docker-compose.yml`,
   il dominio nel `Caddyfile`, poi `docker compose up -d --build` e
   `sudo bash scudo/firewall-stealth.sh`.
5. **Backup**: pianifica `origine/../cassaforte/backup-cifrato.sh` (cron notturno
   sul server origine). Periodicamente accendi la cassaforte e lancia
   `cassaforte/pull-su-cassaforte.sh`.

## Verifica dell'invisibilità
Da una macchina esterna: `nmap -Pn TUO_IP_SCUDO` deve mostrare solo 80/443.
SSH e WireGuard non devono comparire. Il server origine non deve rispondere affatto.

## Cosa questa architettura fa e non fa
- **Fa**: rende il cuore (dati/chiavi) irraggiungibile, nasconde la struttura
  interna, blocca attacchi applicativi, garantisce backup illeggibili e
  ripristinabili anche dopo una compromissione totale del server.
- **Non fa**: rendere invisibile la porta web pubblica (se la trovano i clienti,
  la trova chi attacca) né assorbire DDoS volumetrici enormi. Per quelli, metti
  il piano gratuito di Cloudflare davanti allo scudo: i due si combinano bene.

## Sicurezza operativa
Le chiavi private non lasciano mai la loro macchina. Ruota le chiavi se sospetti
una compromissione. Tieni una copia della chiave privata della cassaforte su
supporto fisico in un cassetto: se la perdi, i backup diventano illeggibili anche
per te.
