#!/usr/bin/env bash
# firewall-origine.sh — il SERVER REALE (sito + database).
# Questo server NON ha un indirizzo pubblico raggiungibile: accetta connessioni
# SOLO dallo scudo, attraverso la rete privata/VPN. Per il resto del mondo
# semplicemente non esiste.
set -euo pipefail

# IP dello scudo SULLA RETE PRIVATA/WIREGUARD (non il suo IP pubblico)
SCUDO_VPN_IP="${SCUDO_VPN_IP:-10.8.0.1}"
APP_PORT="${APP_PORT:-3000}"

echo "[*] Blindo il server origine. Accetta solo lo scudo ($SCUDO_VPN_IP)."

ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# L'app risponde SOLO allo scudo, e solo via VPN
ufw allow from "$SCUDO_VPN_IP" to any port "$APP_PORT" proto tcp

# Amministrazione SSH: solo via VPN
ufw allow from 10.8.0.0/24 to any port 22 proto tcp

# WireGuard
ufw allow 51820/udp

# Niente ping, DROP silenzioso
sed -i 's/^DEFAULT_INPUT_POLICY=.*/DEFAULT_INPUT_POLICY="DROP"/' /etc/default/ufw || true
grep -q icmp_echo_ignore_all /etc/sysctl.conf || echo "net.ipv4.icmp_echo_ignore_all = 1" >> /etc/sysctl.conf
sysctl -p >/dev/null || true

ufw --force enable
echo "[✓] Server origine invisibile: nessuna porta pubblica, solo lo scudo via VPN."
echo "    IMPORTANTE: l'app deve ascoltare sull'IP VPN o 0.0.0.0, mai esporre porte pubbliche dal provider."
