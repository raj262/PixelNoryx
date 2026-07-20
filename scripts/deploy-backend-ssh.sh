#!/usr/bin/env bash
# Deploy PixelNoryx backend to Hostinger (admin.rajeshcodes.in)
#
# Server layout:
#   public_html/subdomainfile/  ← full Laravel backend
#   public_html/admin/          ← web root (public files) for admin.rajeshcodes.in
#
# Usage (Mac Terminal):
#   bash scripts/deploy-backend-ssh.sh

set -euo pipefail

HOST="u161037929@145.79.212.17"
PORT="65002"
REMOTE_APP="domains/rajeshcodes.in/public_html/subdomainfile"
REMOTE_PUBLIC="domains/rajeshcodes.in/public_html/admin"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"

RSYNC_SSH="ssh -p $PORT"

echo "==> 1/3 Sync Laravel app → ~/$REMOTE_APP"
rsync -avz \
  -e "$RSYNC_SSH" \
  --exclude='.env' \
  --exclude='vendor/' \
  --exclude='node_modules/' \
  --exclude='public/' \
  --exclude='storage/logs/*' \
  --exclude='storage/framework/cache/*' \
  --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' \
  --exclude='.git/' \
  --exclude='tests/' \
  "$BACKEND/" \
  "$HOST:$REMOTE_APP/"

echo "==> 2/3 Sync public assets → ~/$REMOTE_PUBLIC"
# Do NOT overwrite existing admin/index.php (already points at subdomainfile)
rsync -avz \
  -e "$RSYNC_SSH" \
  --exclude='index.php' \
  --exclude='storage' \
  --exclude='.user.ini' \
  "$BACKEND/public/" \
  "$HOST:$REMOTE_PUBLIC/"

echo "==> 3/3 Migrate + clear caches"
ssh -p "$PORT" "$HOST" "cd $REMOTE_APP && \
  composer install --no-dev --optimize-autoloader && \
  php artisan migrate --force && \
  php artisan config:clear && \
  php artisan route:clear && \
  php artisan cache:clear && \
  php artisan view:clear && \
  echo '--- legal-pages routes ---' && \
  php artisan route:list --path=legal-pages | head -20"

echo "==> Done"
echo "    Backend: ~/$REMOTE_APP"
echo "    Public:  ~/$REMOTE_PUBLIC  → https://admin.rajeshcodes.in/"
