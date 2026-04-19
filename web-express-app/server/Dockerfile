FROM node:24-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss

EXPOSE 3000
CMD ["node", "index.js"]
