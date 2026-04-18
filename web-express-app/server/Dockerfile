# ── Stage 1: deps & build ────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with a clean, reproducible install
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and generate the client
COPY prisma ./prisma
RUN npm run build

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy installed node_modules (includes generated Prisma client)
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

# Ensure upload directories exist at runtime
RUN mkdir -p uploads/files

EXPOSE 3000

CMD ["node", "index.js"]
