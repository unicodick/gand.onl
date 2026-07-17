import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ensureDiscordProfile,
  getDiscordProfile,
  getDiscordProfileWithSessionFallback,
  upsertDiscordProfile,
} from "../src/lib/server/discord/profiles";

describe("Discord profiles", () => {
  beforeEach(async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  });

  it("stores and refreshes public OAuth identity", async () => {
    await upsertDiscordProfile(env.DB, {
      id: "111111111111111111",
      username: "first_name",
      global_name: null,
      avatar: null,
    });
    await upsertDiscordProfile(env.DB, {
      id: "111111111111111111",
      username: "current_name",
      global_name: "Display Name",
      avatar: "avatar-hash",
    });

    await expect(
      getDiscordProfile(env.DB, "111111111111111111"),
    ).resolves.toMatchObject({
      discord_id: "111111111111111111",
      username: "current_name",
      global_name: "Display Name",
      avatar_hash: "avatar-hash",
    });
  });

  it("keeps OAuth data when ensuring a session fallback", async () => {
    await upsertDiscordProfile(env.DB, {
      id: "222222222222222222",
      username: "oauth_name",
      global_name: "OAuth Name",
      avatar: "oauth-avatar",
    });
    await ensureDiscordProfile(env.DB, "222222222222222222", "session_name");

    await expect(
      getDiscordProfile(env.DB, "222222222222222222"),
    ).resolves.toMatchObject({
      username: "oauth_name",
      global_name: "OAuth Name",
      avatar_hash: "oauth-avatar",
    });
  });

  it("uses the latest session name before the next OAuth refresh", async () => {
    await env.DB.prepare(
      `INSERT INTO sessions
         (token_hash, discord_id, discord_username, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        "fallback-session",
        "333333333333333333",
        "session_name",
        "2099-01-01T00:00:00.000Z",
        "2026-07-17T00:00:00.000Z",
      )
      .run();

    await expect(
      getDiscordProfileWithSessionFallback(env.DB, "333333333333333333"),
    ).resolves.toMatchObject({
      username: "session_name",
      global_name: null,
      avatar_hash: null,
    });
  });
});
