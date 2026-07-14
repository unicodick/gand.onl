# gand.onl

Сайт сообщества сервера zlp.onl.

## Стек

SvelteKit + Tailwind CSS v4, деплой на Cloudflare Pages (`adapter-cloudflare`).

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

Cloudflare Pages, `pages_build_output_dir` — `.svelte-kit/cloudflare` (см. `wrangler.toml`).
