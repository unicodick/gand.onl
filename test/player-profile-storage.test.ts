import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createPlayer,
  getPlayerById,
  getPlayerSocials,
  updatePlayerProfile,
} from "../src/lib/server/players/repository";

beforeEach(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM player_socials"),
    env.DB.prepare("DELETE FROM players"),
  ]);
});

describe("player profile storage", () => {
  it("updates profile fields and socials together", async () => {
    const playerId = await createPlayer(env.DB, "Player");

    await updatePlayerProfile(env.DB, {
      playerId,
      bio: "Updated bio",
      skinUrl: "https://example.com/skin.png",
      socials: [
        { platform: "telegram", url: "https://t.me/player" },
        { platform: "Website", url: "https://example.com" },
      ],
    });

    await expect(getPlayerById(env.DB, playerId)).resolves.toMatchObject({
      bio: "Updated bio",
      skin_url: "https://example.com/skin.png",
    });
    await expect(getPlayerSocials(env.DB, playerId)).resolves.toMatchObject([
      { platform: "telegram", url: "https://t.me/player", sort_order: 0 },
      { platform: "Website", url: "https://example.com", sort_order: 1 },
    ]);
  });

  it("rolls back every profile field when a social write fails", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    await updatePlayerProfile(env.DB, {
      playerId,
      bio: "Original bio",
      skinUrl: "https://example.com/original.png",
      socials: [{ platform: "telegram", url: "https://t.me/original" }],
    });

    await expect(
      updatePlayerProfile(env.DB, {
        playerId,
        bio: "Partial bio",
        skinUrl: "https://example.com/partial.png",
        socials: [{ platform: "telegram", url: null as unknown as string }],
      }),
    ).rejects.toThrow();

    await expect(getPlayerById(env.DB, playerId)).resolves.toMatchObject({
      bio: "Original bio",
      skin_url: "https://example.com/original.png",
    });
    await expect(getPlayerSocials(env.DB, playerId)).resolves.toMatchObject([
      { platform: "telegram", url: "https://t.me/original" },
    ]);
  });
});
