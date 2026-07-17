import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import { linkPlayerByUsername } from "../src/lib/server/players/linking";
import {
  getPlayerByOwnerDiscordId,
  getPlayerByUsername,
  isOwnerConflictError,
} from "../src/lib/server/players/repository";

const FUTURE = "2999-01-01T00:00:00.000Z";

async function createLinkRequest(discordId: string, key: string) {
  await env.DB.prepare(
    "INSERT INTO link_requests (discord_id, key, expires_at) VALUES (?, ?, ?)",
  )
    .bind(discordId, key, FUTURE)
    .run();
}

async function getLinkUsedAt(key: string): Promise<string | null> {
  const row = await env.DB.prepare(
    "SELECT used_at FROM link_requests WHERE key = ?",
  )
    .bind(key)
    .first<{ used_at: string | null }>();
  return row?.used_at ?? null;
}

beforeEach(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM player_socials"),
    env.DB.prepare("DELETE FROM players"),
    env.DB.prepare("DELETE FROM link_requests"),
  ]);
});

describe("linkPlayerByUsername", () => {
  it("links a player and consumes the key", async () => {
    await createLinkRequest("discord-1", "VALIDKEY");

    await expect(
      linkPlayerByUsername(env.DB, "Player", "VALIDKEY"),
    ).resolves.toBe("linked");

    const player = await getPlayerByOwnerDiscordId(env.DB, "discord-1");
    expect(player?.username).toBe("Player");
    expect(await getLinkUsedAt("VALIDKEY")).not.toBeNull();
  });

  it("does not create a player for an invalid key", async () => {
    await expect(
      linkPlayerByUsername(env.DB, "Ghost", "INVALID"),
    ).resolves.toBe("invalid_key");

    expect(await getPlayerByUsername(env.DB, "ghost")).toBeNull();
  });

  it("keeps the key active when the player belongs to someone else", async () => {
    await env.DB.prepare(
      `INSERT INTO players (username, username_lower, owner_discord_id)
       VALUES (?, ?, ?)`,
    )
      .bind("Player", "player", "discord-owner")
      .run();
    await createLinkRequest("discord-other", "OTHERKEY");

    await expect(
      linkPlayerByUsername(env.DB, "Player", "OTHERKEY"),
    ).resolves.toBe("player_owned");
    expect(await getLinkUsedAt("OTHERKEY")).toBeNull();
  });

  it("rolls back a new player when Discord already owns another profile", async () => {
    await env.DB.prepare(
      `INSERT INTO players (username, username_lower, owner_discord_id)
       VALUES (?, ?, ?)`,
    )
      .bind("First", "first", "discord-1")
      .run();
    await createLinkRequest("discord-1", "SECONDKEY");

    try {
      await linkPlayerByUsername(env.DB, "Second", "SECONDKEY");
      expect.unreachable("expected an owner conflict");
    } catch (err) {
      expect(isOwnerConflictError(err)).toBe(true);
    }

    expect(await getPlayerByUsername(env.DB, "second")).toBeNull();
    expect(await getLinkUsedAt("SECONDKEY")).toBeNull();
  });

  it("cannot reuse a consumed key", async () => {
    await createLinkRequest("discord-1", "ONETIME1");
    await linkPlayerByUsername(env.DB, "First", "ONETIME1");

    await expect(
      linkPlayerByUsername(env.DB, "Second", "ONETIME1"),
    ).resolves.toBe("invalid_key");
    expect(await getPlayerByUsername(env.DB, "second")).toBeNull();
  });
});
