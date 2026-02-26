# -------- Stage 1: Build --------
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

# -------- Stage 2: Production --------
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=0 /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]