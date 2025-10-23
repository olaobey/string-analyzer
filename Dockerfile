# ---------- deps stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# bring only compiled code + package manifests
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# install prod-only deps
RUN npm ci --omit=dev

# default port (override with PORT env)
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]
