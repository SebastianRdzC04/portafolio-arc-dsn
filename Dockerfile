# ─────────────────────────────────────────────────────────────────────────────
# portafolio-arc-dsn — Astro 5 SSR (Node standalone adapter) + Puppeteer/Chromium
#
# Multi-stage build:
#   deps     → npm ci full tree (needed for the build)
#   builder  → astro build using deps node_modules + source
#   prod-deps→ npm ci --omit=dev for the runtime image only
#   runtime  → node:22-alpine + chromium + dist/ + prod-only node_modules
#
# Final image is ~250 MB instead of ~770 MB by:
#   - copying only `dist/` + `package.json` + prod node_modules into runtime
#   - running as a non-root user
#   - stripping dev deps, source maps, and type defs
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: install full deps (build needs devDeps like typescript) ──────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── Stage 2: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY astro.config.mjs ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public

ENV NODE_ENV=production
RUN npm run build

# ── Stage 3: install production-only deps for runtime ────────────────────────
FROM node:22-alpine AS prod-deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
 && find node_modules -type f \( \
      -name "*.map" -o -name "*.d.ts" -o -name "*.d.ts.map" \
      -o -name "*.d.mts" -o -name "*.d.cts" \
      -o -name "*.markdown" -o -name "CHANGELOG*" -o -name "HISTORY*" \
      -o -name "AUTHORS" -o -name "CONTRIBUTORS" \
    \) -delete 2>/dev/null || true

# ── Stage 4: runtime ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

# Chromium runtime deps for Puppeteer (Alpine) — installed before the user
# drop so the apk layer is shared by `apk add` cache in subsequent rebuilds.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy only what the runtime needs (saves ~500 MB vs copying source + devDeps)
COPY --from=builder  --chown=app:app /app/dist          ./dist
COPY --from=prod-deps --chown=app:app /app/node_modules  ./node_modules
COPY --from=builder  --chown=app:app /app/package.json   ./package.json

USER app

EXPOSE 80

# Healthcheck uses 127.0.0.1 (not localhost) so wget doesn't resolve to IPv6
# when the server only binds 0.0.0.0.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["node", "./dist/server/entry.mjs"]
