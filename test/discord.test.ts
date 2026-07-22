import { describe, expect, it } from "vitest";
import {
  canPreserveDiscordVisibility,
  discordAvatarUrl,
  discordProfileUrl,
} from "../src/lib/discord/model";

describe("Discord profile presentation", () => {
  it("builds custom and default avatar URLs", () => {
    expect(discordAvatarUrl("123456789", "avatar-hash")).toBe(
      "https://cdn.discordapp.com/avatars/123456789/avatar-hash.png?size=128",
    );
    expect(discordAvatarUrl("0", null)).toBe(
      "https://cdn.discordapp.com/embed/avatars/0.png",
    );
  });

  it("builds a public Discord profile URL", () => {
    expect(discordProfileUrl("123456789")).toBe(
      "https://discord.com/users/123456789",
    );
  });

  it("does not transfer profile visibility between owners", () => {
    expect(canPreserveDiscordVisibility("owner-1", "owner-1")).toBe(true);
    expect(canPreserveDiscordVisibility("owner-1", "owner-2")).toBe(false);
    expect(canPreserveDiscordVisibility("owner-1", null)).toBe(false);
    expect(canPreserveDiscordVisibility(null, null)).toBe(false);
  });
});
