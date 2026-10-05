# Portfólio pessoal + API de apoio

Frontend estático para GitHub Pages e API serverless de doações em Cloudflare Workers.

## Conteúdo público

O currículo exibido no site é editado em `frontend/data/profile.json`. Inclua somente informações que possam ser divulgadas publicamente. O arquivo de origem `CV.md` não é publicado pelo workflow, que envia somente `frontend/`.

O download de currículo PDF está desativado até que exista uma versão revisada para publicação.

## Deploy do frontend

1. Envie o projeto para um repositório GitHub.
2. Em Settings > Pages, selecione GitHub Actions como fonte.
3. O workflow `.github/workflows/pages.yml` publica a pasta `frontend/`.

## Deploy da API

```bash
cd backend/donate-api
npm install
npx wrangler login
npm run dev
npm run deploy
```

Depois do deploy, configure `API_URL` em `frontend/js/app.js` com a URL pública do Worker e ajuste `ALLOWED_ORIGIN` em `backend/donate-api/wrangler.toml` para a origem do site. A API usa provider DEMO por padrão; para pagamentos reais, implemente o provider em `src/index.js` e armazene credenciais com `wrangler secret put`.
