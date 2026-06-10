#!/usr/bin/env bash
# firewall-stealth.sh — rende il SERVER SCUDO "invisibile" agli scanner.
# Da eseguire come root sul server pubblico (Ubuntu/Debian con ufw).
# Effetto: rispondono solo le porte web (80/443). Tutto il resto è DROP
# (pacchetto scartato senza risposta) -> per nmap il server appare "filtrato/morto".
set -euo pipefail

echo "[*] Configuro firewall stealth..."

# Policy di default: nega tutto in ingresso, consenti uscita
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Web pubblico (l'unica superficie visibile)
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp        # HTTP/3

# SSH: NON aperto al mondo. Solo dalla VPN WireGuard (vedi livello 3).
# Sostituisci 10.8.0.0/24 con la tua subnet WireGuard.
ufw allow from 10.8.0.0/24 to any port 22 proto tcp

# WireGuard stesso (cambia 51820 con la tua porta; tienila non standard)
ufw allow 51820/udp

# DROP silenzioso invece di REJECT: niente "porta chiusa", solo silenzio.
sed -i 's/^DEFAULT_INPUT_POLICY=.*/DEFAULT_INPUT_POLICY="DROP"/' /etc/default/ufw || true

# Non rispondere ai ping (riduce la rilevabilità)
if ! grep -q "net.ipv4.icmp_echo_ignore_all" /etc/sysctl.conf; then
  echo "net.ipv4.icmp_echo_ignore_all = 1" >> /etc/sysctl.conf
fi
sysctl -p >/dev/null || true

ufw --force enable
echo "[✓] Scudo in modalità stealth: visibili solo 80/443. SSH solo via VPN."
echo "    Verifica da un'altra macchina:  nmap -Pn TUO_IP"
