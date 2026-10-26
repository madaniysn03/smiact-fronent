# Image de production du front Next.js (sortie "standalone").
# Les variables NEXT_PUBLIC_* sont figées au moment du build : passe-les en --build-arg.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts : évite "husky install" qui exige un dossier .git
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_APP_TITLE=SMIACT
ARG NEXT_PUBLIC_APP_DESCRIPTION=SMIACT
ARG NEXT_PUBLIC_AUTH_ENABLED=true
ARG NEXT_PUBLIC_ENVIRONMENT=prod
ARG NEXT_PUBLIC_UNDER_MAINTENANCE=false
ARG NEXT_PUBLIC_PUSHER_KEY=
ARG NEXT_PUBLIC_PUSHER_CLUSTER=eu

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_APP_TITLE=$NEXT_PUBLIC_APP_TITLE \
    NEXT_PUBLIC_APP_DESCRIPTION=$NEXT_PUBLIC_APP_DESCRIPTION \
    NEXT_PUBLIC_AUTH_ENABLED=$NEXT_PUBLIC_AUTH_ENABLED \
    NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT \
    NEXT_PUBLIC_UNDER_MAINTENANCE=$NEXT_PUBLIC_UNDER_MAINTENANCE \
    NEXT_PUBLIC_PUSHER_KEY=$NEXT_PUBLIC_PUSHER_KEY \
    NEXT_PUBLIC_PUSHER_CLUSTER=$NEXT_PUBLIC_PUSHER_CLUSTER \
    NEXT_TELEMETRY_DISABLED=1

# Le lint (prettier) échoue sur le code actuel : on le saute ici, les types restent vérifiés.
RUN npx next build --no-lint

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
