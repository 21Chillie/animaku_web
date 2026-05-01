FROM node:24-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder

COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY views ./views
RUN npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
