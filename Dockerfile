# ---------- Build Stage ----------
FROM node:20-slim AS build

WORKDIR /app

# Copy dependency files and install everything
COPY package*.json ./
RUN npm install

# Copy source code and build it
COPY . .
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-slim

WORKDIR /app

# ✅ Copy package files first
COPY package*.json ./

# ✅ Install only production dependencies
RUN npm install --omit=dev

# ✅ Copy the compiled dist files
COPY --from=build /app/dist ./dist

# Expose port (Cloud Run will inject $PORT)
EXPOSE 3000

# ✅ Start the app using the compiled files
CMD ["node", "dist/main.js"]
