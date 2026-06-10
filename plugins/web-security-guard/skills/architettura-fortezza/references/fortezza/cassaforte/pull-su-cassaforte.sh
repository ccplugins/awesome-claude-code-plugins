#!/usr/bin/env bash
# pull-su-cassaforte.sh — gira sulla CASSAFORTE (macchina offline/air-gapped,
# es. un mini-PC o un disco che colleghi solo quando serve).
#
# Direzione UNICA: è la cassaforte ad andare a PRENDERE i backup dal server,
# il server non può MAI iniziare una connessione verso la cassaforte e non ne
# conosce nemmeno l'esistenza. Così non c'è un percorso che un attaccante possa
# risalire dal server verso il cuore del sistema.
#
# Uso tipico: accendi la cassaforte, la colleghi alla VPN per pochi minuti,
# lanci lo script, poi la stacchi di nuovo. Niente di permanente.
set -euo pipefail

ORIGINE_VPN="${ORIGINE_VPN:-10.8.0.2}"          # IP VPN del server origine
REMOTE_DIR="${REMOTE_DIR:-/var/backups/fortezza}"
LOCAL_DIR="${LOCAL_DIR:-$HOME/fortezza-backups}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/cassaforte_ed25519}"
PRIV_KEY="${PRIV_KEY:-$HOME/.fortezza/cassaforte.key}"   # chiave PRIVATA: vive SOLO qui

mkdir -p "$LOCAL_DIR"

echo "[*] Scarico i backup cifrati dal server origine (sola lettura)..."
rsync -av --ignore-existing -e "ssh -i $SSH_KEY" \
  "fortezza@${ORIGINE_VPN}:${REMOTE_DIR}/backup-*.tar.gz.age" "$LOCAL_DIR/"

echo "[✓] Backup al sicuro nella cassaforte: $LOCAL_DIR"
echo
echo "Per RIPRISTINARE un backup (solo qui, offline):"
echo "  age -d -i $PRIV_KEY backup-XXXX.tar.gz.age | tar -xzf - "
echo
echo "Ora puoi scollegare la cassaforte dalla rete."
