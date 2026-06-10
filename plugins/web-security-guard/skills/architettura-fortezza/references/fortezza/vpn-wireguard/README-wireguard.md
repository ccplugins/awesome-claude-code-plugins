# Livello 3 — Tunnel WireGuard (il "corridoio invisibile")

WireGuard collega scudo, server origine e postazione di amministrazione su una
rete privata cifrata. È la chiave dell'invisibilità: un server WireGuard **non
risponde a nessun pacchetto** che non sia firmato con una chiave valida. Per uno
scanner (nmap, Shodan) la porta UDP appare chiusa/inesistente — non c'è nulla con
cui dialogare, nessun banner, nessun handshake. Solo chi possiede la chiave entra.

## Schema indirizzi (esempio)
- Scudo            → 10.8.0.1
- Server origine   → 10.8.0.2
- Tua postazione   → 10.8.0.3

## Installazione (su ogni macchina)
```bash
sudo apt update && sudo apt install -y wireguard
wg genkey | tee privatekey | wg pubkey > publickey   # genera la coppia di chiavi
```

## Esempio config server origine — /etc/wireguard/wg0.conf
```ini
[Interface]
Address = 10.8.0.2/24
ListenPort = 51820
PrivateKey = <CHIAVE_PRIVATA_ORIGINE>

# Scudo
[Peer]
PublicKey = <CHIAVE_PUBBLICA_SCUDO>
AllowedIPs = 10.8.0.1/32

# Postazione admin
[Peer]
PublicKey = <CHIAVE_PUBBLICA_ADMIN>
AllowedIPs = 10.8.0.3/32
```

## Esempio config scudo — /etc/wireguard/wg0.conf
```ini
[Interface]
Address = 10.8.0.1/24
PrivateKey = <CHIAVE_PRIVATA_SCUDO>

[Peer]
PublicKey = <CHIAVE_PUBBLICA_ORIGINE>
AllowedIPs = 10.8.0.2/32
Endpoint = <IP_PUBBLICO_ORIGINE>:51820
PersistentKeepalive = 25
```

## Avvio
```bash
sudo systemctl enable --now wg-quick@wg0
sudo wg            # mostra i peer connessi
```

## Regole d'oro
- Le chiavi private NON lasciano mai la loro macchina. Backup della chiave admin solo nella cassaforte offline.
- Cambia la porta 51820 con una porta UDP alta e casuale: ulteriore riduzione della rilevabilità.
- Solo gli `AllowedIPs` elencati possono parlare: nessun altro, nemmeno con la porta giusta, viene accettato.
