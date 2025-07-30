# --- Dockerfile Multi-Estágio para Frontend Next.js ---

# --- Estágio 1: Construção (Build) ---
# Usamos uma imagem Node.js para instalar as dependências e construir o projeto.
FROM node:18-alpine AS builder
WORKDIR /app

# Copia os ficheiros de configuração e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Constrói a aplicação para produção
RUN npm run build

# --- Estágio 2: Produção ---
# Usamos uma imagem mais pequena para servir a aplicação já construída.
FROM node:18-alpine
WORKDIR /app

# Copia os ficheiros de configuração da aplicação
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copia a pasta '.next' que contém a aplicação construída
COPY --from=builder /app/.next ./.next

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor Next.js em modo de produção
CMD ["npm", "start"]
