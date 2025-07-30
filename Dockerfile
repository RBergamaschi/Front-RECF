FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# --- Estágio 2: Produção ---
# Usamos uma imagem mais pequena para servir a aplicação já construída.
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copia a pasta '.next' que contém a aplicação construída
COPY --from=builder /app/.next ./.next

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor Next.js em modo de produção
CMD ["npm", "start"]
