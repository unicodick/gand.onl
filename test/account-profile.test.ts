import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import { actions, load } from "../src/routes/account/+page.server";
import {
  createPlayer,
  getPlayerById,
  getPlayerSocials,
  setPlayerOwner,
  updatePlayerProfile,
} from "../src/lib/server/players/repository";

beforeEach(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM player_socials"),
    env.DB.prepare("DELETE FROM players"),
    env.DB.prepare("DELETE FROM link_requests"),
    env.DB.prepare("DELETE FROM discord_profiles"),
  ]);
});

describe("account profile editor", () => {
  it("loads the signed-in player's editable profile", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    await setPlayerOwner(env.DB, playerId, "owner");
    await updatePlayerProfile(env.DB, {
      playerId,
      bio: "Current bio",
      skinUrl: "https://example.com/current.png",
      socials: [{ platform: "telegram", url: "https://t.me/current" }],
    });

    const result = await load({
      platform: { env },
      locals: { user: { discordId: "owner", username: "owner" } },
      url: new URL("https://gand.onl/account?saved=1"),
    } as never);

    expect(result).toMatchObject({
      player: { id: playerId, username: "Player", bio: "Current bio" },
      socials: [{ platform: "telegram", url: "https://t.me/current" }],
      saved: true,
    });
  });

  it("updates the signed-in player's profile", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    await setPlayerOwner(env.DB, playerId, "owner");
    const form = new FormData();
    form.set("bio", "Updated bio");
    form.set("skin_url", "https://example.com/updated.png");
    form.set("social_telegram", "https://t.me/updated");

    await expect(
      actions.default!({
        request: new Request("https://gand.onl/account", {
          method: "POST",
          body: form,
        }),
        platform: { env },
        locals: { user: { discordId: "owner", username: "owner" } },
      } as never),
    ).rejects.toMatchObject({
      status: 303,
      location: "/account?saved=1",
    });

    await expect(getPlayerById(env.DB, playerId)).resolves.toMatchObject({
      bio: "Updated bio",
      skin_url: "https://example.com/updated.png",
    });
    await expect(getPlayerSocials(env.DB, playerId)).resolves.toMatchObject([
      { platform: "telegram", url: "https://t.me/updated" },
    ]);
  });

  it("rejects profile writes without a linked player", async () => {
    await expect(
      actions.default!({
        request: new Request("https://gand.onl/account", {
          method: "POST",
          body: new FormData(),
        }),
        platform: { env },
        locals: { user: { discordId: "owner", username: "owner" } },
      } as never),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("does not expose editable links for blocked profiles", async () => {
    const playerId = await createPlayer(env.DB, "Player");
    await setPlayerOwner(env.DB, playerId, "owner");
    await updatePlayerProfile(env.DB, {
      playerId,
      bio: "Hidden bio",
      skinUrl: "https://example.com/hidden.png",
      socials: [{ platform: "telegram", url: "https://t.me/hidden" }],
    });
    await env.DB.prepare(
      "UPDATE players SET blocked_at = ?, blocked_by_discord_id = ? WHERE id = ?",
    )
      .bind("2026-07-20T12:00:00.000Z", "admin", playerId)
      .run();

    const result = await load({
      platform: { env },
      locals: { user: { discordId: "owner", username: "owner" } },
      url: new URL("https://gand.onl/account"),
    } as never);

    expect(result).toMatchObject({
      player: { id: playerId, bio: null, skin_url: null },
      socials: [],
    });
  });

  it("rejects anonymous profile writes", async () => {
    await expect(
      actions.default!({
        request: new Request("https://gand.onl/account", {
          method: "POST",
          body: new FormData(),
        }),
        platform: { env },
        locals: {},
      } as never),
    ).rejects.toMatchObject({ status: 401 });
  });
});
