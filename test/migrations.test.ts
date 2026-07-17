import { applyD1Migrations, env } from "cloudflare:test";
import { expect, it } from "vitest";

it("preserves player socials during the username identity migration", async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(0, 2));

  await env.DB.prepare(
    "INSERT INTO players (uuid, username, username_lower) VALUES (?, ?, ?)",
  )
    .bind("player-uuid", "Player", "player")
    .run();
  await env.DB.prepare(
    "INSERT INTO player_socials (player_id, platform, url) VALUES (?, ?, ?)",
  )
    .bind(1, "telegram", "https://t.me/player")
    .run();

  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(2));

  const social = await env.DB.prepare(
    "SELECT player_id, platform, url FROM player_socials WHERE player_id = ?",
  )
    .bind(1)
    .first<{ player_id: number; platform: string; url: string }>();

  expect(social).toEqual({
    player_id: 1,
    platform: "telegram",
    url: "https://t.me/player",
  });
});

it("adds empty news metadata without changing existing posts", async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(0, 3));

  await env.DB.prepare(
    `INSERT INTO news (slug, title, body, published, author_discord_id)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind("existing-post", "Existing post", "Body", 1, "author")
    .run();

  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(3));

  const news = await env.DB.prepare(
    "SELECT cover_key, tags FROM news WHERE slug = ?",
  )
    .bind("existing-post")
    .first<{ cover_key: string | null; tags: string }>();

  expect(news).toEqual({ cover_key: null, tags: "[]" });
});

it("adds moderation fields without blocking existing players", async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(0, 5));

  await env.DB.prepare(
    "INSERT INTO players (username, username_lower) VALUES (?, ?)",
  )
    .bind("Existing", "existing")
    .run();

  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(5));

  const player = await env.DB.prepare(
    `SELECT blocked_at, blocked_by_discord_id, block_reason
     FROM players WHERE username_lower = ?`,
  )
    .bind("existing")
    .first<{
      blocked_at: string | null;
      blocked_by_discord_id: string | null;
      block_reason: string | null;
    }>();

  expect(player).toEqual({
    blocked_at: null,
    blocked_by_discord_id: null,
    block_reason: null,
  });
});
