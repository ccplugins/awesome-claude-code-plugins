#!/usr/bin/env bash
# genera-chiavi.sh — ESEGUIRE UNA SOLA VOLTA, sulla CASSAFORTE OFFLINE.
# Genera la coppia di chiavi della cassaforte.
#   - chiave PRIVATA: resta qui, non lascia MAI questa macchina.
#   - chiave PUBBLICA: la copi sul server origine, serve solo a cifrare.
set -euo pipefail
DIR="${DIR:-$HOME/.fortezza}"
mkdir -p "$DIR"; chmod 700 "$DIR"

if [ -f "$DIR/cassaforte.key" ]; then
  echo "Esiste già una chiave in $DIR — interrompo per non sovrascriverla."
  exit 1
fi

age-keygen -o "$DIR/cassaforte.key"
grep 'public key:' "$DIR/cassaforte.key" | sed 's/# public key: //' > "$DIR/cassaforte.pub"
chmod 600 "$DIR/cassaforte.key"

echo "[✓] Chiavi generate in $DIR"
echo "    PRIVATA: $DIR/cassaforte.key  -> NON copiarla da nessuna parte. Fanne una copia su carta/USB in cassetto."
echo "    PUBBLICA: $DIR/cassaforte.pub -> copiala sul server origine in /etc/fortezza/cassaforte.pub"
echo
echo "Senza la chiave privata, NESSUN backup è leggibile. Se la perdi, perdi i backup: custodiscila."
