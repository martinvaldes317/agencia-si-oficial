FROM node:24-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy" npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node index.js"]
