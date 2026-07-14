# gand.onl

Сайт сообщества сервера zlp.onl.

## Стек

SvelteKit + Tailwind CSS v4, деплой на Cloudflare Workers (`adapter-cloudflare`, static assets).

## Разработка

```sh
pnpm install
pnpm dev
```

## Проверки

```sh
pnpm check   # typecheck
pnpm build   # прод-сборка
```

## Деплой

Cloudflare Workers со статическими ассетами: `main` и `[assets]` в `wrangler.toml`. Автодеплой на пуш в `main` через git-интеграцию Cloudflare.
