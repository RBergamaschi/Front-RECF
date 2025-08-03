# --- Estágio 1: Construção (Build) ---
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "VERIFICANDO VARIAVEL: O valor de NEXT_PUBLIC_API_URL é $NEXT_PUBLIC_API_URL"

RUN npm run build

# --- Estágio 2: Produção ---
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor Next.js em modo de produção
CMD ["npm", "start"]
