# Контрибьютинг

## Коммиты

Минималистичный conventional-commit стиль, на английском, без тела:

```
type(scope): text
```

Примеры: `fix(deps): bump wrangler to v4`, `feat(players): add public player directory`.

Без multi-line описаний и лишних футеров.

## Ветки

- `main` — прод, защищена (обязателен зелёный CI, мерж только через PR).
- `alpha` — интеграционная ветка, копия `main`.
- Фичи веткуются от `alpha`, называются `feat/<name>`, PR идёт в `alpha`.
- Когда `alpha` готова к релизу — отдельный PR `alpha → main`.

## Перед PR

```sh
pnpm format:check
pnpm check
pnpm test
pnpm build
```
