#!/usr/bin/env bash
# backup-cifrato.sh — gira sul SERVER ORIGINE.
# Crea un backup del database cifrato con la CHIAVE PUBBLICA della cassaforte.
#
# Punto chiave dell'architettura "scatola chiusa":
# il server origine ha SOLO la chiave PUBBLICA. Può cifrare e creare backup,
# ma NON può rileggerli. Solo la cassaforte offline, che custodisce la chiave
# PRIVATA, può decifrarli. Anche se un attaccante prendesse il controllo totale
# del server, otterrebbe archivi illeggibili.
set -euo pipefail

OUT_DIR="${OUT_DIR:-/var/backups/fortezza}"
PUB_KEY="${PUB_KEY:-/etc/fortezza/cassaforte.pub}"   # solo chiave pubblica, mai la privata
STAMP="$(date +%Y%m%d-%H%M%S)"
TMP="$(mktemp -d)"
mkdir -p "$OUT_DIR"

echo "[*] Dump del database..."
# Adatta al tuo DB. Esempi:
#   PostgreSQL: pg_dump "$DATABASE_URL" > "$TMP/db.sql"
#   MySQL:      mysqldump --single-transaction db > "$TMP/db.sql"
pg_dump "${DATABASE_URL:?DATABASE_URL mancante}" > "$TMP/db.sql"

echo "[*] Comprimo e cifro con la chiave pubblica della cassaforte (age)..."
# 'age' = strumento di cifratura moderno e semplice (https://age-encryption.org)
tar -czf "$TMP/backup.tar.gz" -C "$TMP" db.sql
age -R "$PUB_KEY" -o "$OUT_DIR/backup-$STAMP.tar.gz.age" "$TMP/backup.tar.gz"

# Pulizia dei file in chiaro
shred -u "$TMP/db.sql" "$TMP/backup.tar.gz" 2>/dev/null || rm -f "$TMP/db.sql" "$TMP/backup.tar.gz"
rmdir "$TMP" 2>/dev/null || true

# Conserva solo gli ultimi 14 backup cifrati
ls -1t "$OUT_DIR"/backup-*.tar.gz.age 2>/dev/null | tail -n +15 | xargs -r rm -f

echo "[✓] Backup cifrato pronto: $OUT_DIR/backup-$STAMP.tar.gz.age"
echo "    Questo file è ILLEGGIBILE senza la chiave privata custodita offline."
