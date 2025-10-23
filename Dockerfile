# Step 1: Build the app
FROM node:20-slim AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Step 2: Run the app in production
FROM node:20-slim

WORKDIR /app

COPY --from=build /app/dist /app

RUN npm install --production

CMD ["node", "dist/main.js"]
