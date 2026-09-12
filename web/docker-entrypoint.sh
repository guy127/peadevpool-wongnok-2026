#!/bin/sh
set -e

# /app/node_modules is an anonymous volume that Compose carries across container
# recreates, so it can hold deps from an older image build. Reinstall whenever the
# bind-mounted lockfile differs from what the volume was last installed from.
STAMP=/app/node_modules/.lockfile-stamp
CURRENT=$(md5sum /app/package-lock.json | cut -d' ' -f1)

if [ ! -f "$STAMP" ] || [ "$(cat "$STAMP")" != "$CURRENT" ]; then
  echo "[entrypoint] lockfile changed or node_modules unstamped - running npm ci"
  npm ci
  echo "$CURRENT" > "$STAMP"
else
  echo "[entrypoint] node_modules up to date with package-lock.json"
fi

exec "$@"
