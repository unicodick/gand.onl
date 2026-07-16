# gand.onl

Сайт сообщества сервера zlp.onl.

## Стек

SvelteKit + Tailwind CSS v4, Cloudflare Workers (D1, Workers Assets).

## Разработка

```sh
pnpm install
cp .dev.vars.example .dev.vars   # заполнить Discord OAuth2 секреты
pnpm exec wrangler d1 migrations apply gandonl --local
pnpm dev
```

## Проверки

```sh
pnpm check   # typecheck
pnpm build   # прод-сборка
```
