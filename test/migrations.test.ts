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
