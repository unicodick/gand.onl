import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import {
  listRecentAdminActions,
  setPlayerBlocked,
} from "../src/lib/server/admin";
import {
  createPlayer,
  getPlayerById,
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
});
