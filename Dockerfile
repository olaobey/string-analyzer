# ---------- build stage ----------
FROM node:20-slim AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (dev included)
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-slim

WORKDIR /app

# Copy only built files
COPY --from=build /app/dist ./dist

# Copy package.json and package-lock.json to install prod dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Cloud Run listens on $PORT
ENV PORT 8080
EXPOSE 8080

# Start the app
CMD ["node", "dist/main.js"]
