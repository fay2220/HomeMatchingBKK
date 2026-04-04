FROM node:20-alpine

WORKDIR /app

# Install OpenSSL 1.1 (required by Prisma query engine on alpine)
RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
