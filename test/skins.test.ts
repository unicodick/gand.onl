import { describe, expect, it } from "vitest";
import { playerSkin, skinRender } from "../src/lib/minecraft/skins";

describe("player skins", () => {
  it("uses valid HTTPS custom skins", () => {
    expect(playerSkin("player", "https://example.com/skin.png")).toBe(
      "https://example.com/skin.png",
    );
  });

  it("falls back to the renderer for insecure or malformed URLs", () => {
    expect(playerSkin("player", "http://example.com/skin.png")).toBe(
      skinRender("player"),
    );
    expect(playerSkin("player", "https://")).toBe(skinRender("player"));
  });
});
