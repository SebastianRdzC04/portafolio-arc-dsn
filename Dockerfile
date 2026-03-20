# ── Stage 1: install deps ─────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ── Stage 2: build app ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY --from=builder /app/dist ./dist

# Chromium deps for Puppeteer in Alpine
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 80

CMD ["node", "./dist/server/entry.mjs"]
