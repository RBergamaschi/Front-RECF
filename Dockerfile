FROM node:18-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.production

RUN rm -rf .next

RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]
