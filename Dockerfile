# ---------- deps stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install all dependencies (including dev) for building
RUN npm ci --include=dev

# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the NestJS project
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Cloud Run expects the app to listen on $PORT
ENV PORT=8080
EXPOSE 8080

# Start the built app
CMD ["node", "dist/main.js"]
