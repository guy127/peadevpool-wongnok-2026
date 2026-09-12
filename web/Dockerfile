# syntax=docker/dockerfile:1.7

# Development image: runs `next dev` with the source bind-mounted from the host,
# so edits hot-reload without rebuilding. Not suitable for production.
FROM node:24-alpine

WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
# The bind mount in compose.yml overlays /app, but node_modules is preserved
# by an anonymous volume so this install survives.
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
  npm ci

# Record which lockfile this node_modules was installed from. The entrypoint
# compares it against the bind-mounted lockfile at startup, so a fresh image
# skips the reinstall and a stale anonymous volume triggers one.
RUN md5sum package-lock.json | cut -d' ' -f1 > /app/node_modules/.lockfile-stamp

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# next dev binds 0.0.0.0 by default; -H is explicit for clarity in containers.
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
