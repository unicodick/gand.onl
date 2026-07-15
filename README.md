# gand.onl

Сайт сообщества сервера zlp.onl.

## Стек

SvelteKit + Tailwind CSS v4, деплой на Cloudflare Workers (`adapter-cloudflare`, static assets).

## Разработка

```sh
pnpm install
pnpm dev
```

Новости и админка (`/news`, `/admin`) читают Cloudflare D1 и требуют секретов Discord OAuth2 — см. ниже.

## Новости и админка

`/news` — публичный список опубликованных новостей, `/admin` — защищённая панель для их написания. Вход в админку — через Discord OAuth2, доступ ограничен whitelist'ом Discord ID (`ADMIN_DISCORD_IDS`), без проверки ролей на гилде.

Хранилище — Cloudflare D1 (`migrations/`), схема в `migrations/0001_init.sql`.

### Discord-приложение

1. Создать приложение на [Discord Developer Portal](https://discord.com/developers/applications).
2. В OAuth2 → Redirects добавить:
   - `http://localhost:5173/auth/discord/callback` (dev)
   - `https://gand.onl/auth/discord/callback` (prod)
3. Client ID и Client Secret понадобятся для секретов ниже.

### Секреты

Локально — скопировать `.dev.vars.example` в `.dev.vars` (уже в `.gitignore`) и заполнить:

```sh
cp .dev.vars.example .dev.vars
```

В проде — через `wrangler secret put`:

```sh
pnpm exec wrangler secret put DISCORD_CLIENT_ID
pnpm exec wrangler secret put DISCORD_CLIENT_SECRET
pnpm exec wrangler secret put ADMIN_DISCORD_IDS
```

`DISCORD_REDIRECT_URI` для прода задан как обычная переменная в `[vars]` в `wrangler.toml`.

### Миграции D1

```sh
pnpm exec wrangler d1 migrations apply gandonl --local   # локально
pnpm exec wrangler d1 migrations apply gandonl --remote  # прод
```

## Проверки

```sh
pnpm check   # typecheck
pnpm build   # прод-сборка
```

## Деплой

Cloudflare Workers со статическими ассетами: `main` и `[assets]` в `wrangler.toml`. Автодеплой на пуш в `main` через git-интеграцию Cloudflare.
