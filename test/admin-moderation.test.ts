import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import {
  deletePlayerAsAdmin,
  getAdminStats,
  listRecentAdminActions,
  setPlayerBlocked,
  updatePlayerAsAdmin,
} from "../src/lib/server/admin";
import {
  createPlayer,
  getPlayerById,
  getPlayerSocials,
  replacePlayerSocials,
  toPublicPlayer,
  updatePlayerBio,
} from "../src/lib/server/players";

beforeEach(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM admin_audit_log"),
    env.DB.prepare("DELETE FROM players"),
  ]);
});

describe("player moderation", () => {
  it("blocks and restores a profile without deleting its content", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    await updatePlayerBio(env.DB, playerId, "Existing bio");
    const player = (await getPlayerById(env.DB, playerId))!;

    await setPlayerBlocked(env.DB, {
      player,
      actorDiscordId: "admin-1",
      blocked: true,
      reason: " Internal reason ",
    });

    const blocked = (await getPlayerById(env.DB, playerId))!;
    expect(blocked).toMatchObject({
      bio: "Existing bio",
      blocked_by_discord_id: "admin-1",
      block_reason: "Internal reason",
    });
    expect(blocked.blocked_at).not.toBeNull();

    await setPlayerBlocked(env.DB, {
      player: blocked,
      actorDiscordId: "admin-2",
      blocked: false,
    });

    await expect(getPlayerById(env.DB, playerId)).resolves.toMatchObject({
      bio: "Existing bio",
      blocked_at: null,
      blocked_by_discord_id: null,
      block_reason: null,
    });
  });

  it("keeps moderation details private and records actions", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    const player = (await getPlayerById(env.DB, playerId))!;

    await setPlayerBlocked(env.DB, {
      player,
      actorDiscordId: "admin-1",
      blocked: true,
      reason: "Private note",
    });

    const blocked = (await getPlayerById(env.DB, playerId))!;
    expect(toPublicPlayer(blocked)).not.toHaveProperty("block_reason");
    expect(toPublicPlayer(blocked)).not.toHaveProperty("blocked_by_discord_id");
    await expect(listRecentAdminActions(env.DB)).resolves.toMatchObject([
      {
        actor_discord_id: "admin-1",
        action: "player.blocked",
        player_id: playerId,
        player_username: "Player",
        details: { reason: "Private note" },
      },
    ]);
  });

  it("updates profile fields and records only changed sections", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    await replacePlayerSocials(env.DB, playerId, [
      { platform: "telegram", url: "https://t.me/old" },
    ]);
    const player = (await getPlayerById(env.DB, playerId))!;
    const existingSocials = await getPlayerSocials(env.DB, playerId);

    await expect(
      updatePlayerAsAdmin(env.DB, {
        player,
        existingSocials,
        actorDiscordId: "admin-1",
        ownerDiscordId: "12345678901234567",
        bio: "Updated bio",
        skinUrl: "",
        socials: [{ platform: "telegram", url: "https://t.me/new" }],
      }),
    ).resolves.toEqual(["owner", "bio", "socials"]);

    await expect(getPlayerById(env.DB, playerId)).resolves.toMatchObject({
      owner_discord_id: "12345678901234567",
      bio: "Updated bio",
    });
    await expect(getPlayerSocials(env.DB, playerId)).resolves.toMatchObject([
      { platform: "telegram", url: "https://t.me/new" },
    ]);
    await expect(listRecentAdminActions(env.DB)).resolves.toMatchObject([
      {
        action: "player.updated",
        details: { fields: ["owner", "bio", "socials"] },
      },
    ]);
  });

  it("keeps a deletion event after removing an erroneous player", async () => {
    const playerId = await createPlayer(env.DB, "Mistake");
    const player = (await getPlayerById(env.DB, playerId))!;

    await deletePlayerAsAdmin(env.DB, {
      player,
      actorDiscordId: "admin-1",
    });

    await expect(getPlayerById(env.DB, playerId)).resolves.toBeNull();
    await expect(listRecentAdminActions(env.DB)).resolves.toMatchObject([
      {
        action: "player.deleted",
        player_id: null,
        player_username: "Mistake",
      },
    ]);
  });

  it("summarizes player and news counts", async () => {
    const firstId = await createPlayer(env.DB, "First");
    const secondId = await createPlayer(env.DB, "Second");
    const first = (await getPlayerById(env.DB, firstId))!;
    await updatePlayerAsAdmin(env.DB, {
      player: first,
      existingSocials: [],
      actorDiscordId: "admin-1",
      ownerDiscordId: "12345678901234567",
      bio: "",
      skinUrl: "",
      socials: [],
    });
    const second = (await getPlayerById(env.DB, secondId))!;
    await setPlayerBlocked(env.DB, {
      player: second,
      actorDiscordId: "admin-1",
      blocked: true,
    });
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO news
           (slug, title, body, published, author_discord_id)
         VALUES ('published', 'Published', 'Body', 1, 'admin-1')`,
      ),
      env.DB.prepare(
        `INSERT INTO news
           (slug, title, body, published, author_discord_id)
         VALUES ('draft', 'Draft', 'Body', 0, 'admin-1')`,
      ),
    ]);

    await expect(getAdminStats(env.DB)).resolves.toEqual({
      playersTotal: 2,
      playersLinked: 1,
      playersUnlinked: 1,
      playersBlocked: 1,
      newsPublished: 1,
      newsDrafts: 1,
    });
  });
});
