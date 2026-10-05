# Donate API

Cloudflare Worker para iniciar doações. O modo DEMO não processa dinheiro.

## Local
`npm install && npm run dev`

## Deploy
`npx wrangler login && npm run deploy`

## Produção
Altere `ALLOWED_ORIGIN`, configure secrets com `wrangler secret put PAYMENT_API_KEY` e implemente o gateway em `src/index.js`. Nunca exponha credenciais no frontend. Webhooks devem validar assinatura e idempotência.

Rotas: `GET /api/health`, `GET /api/donations/config`, `POST /api/donations`, `POST /api/webhooks/payment`.
