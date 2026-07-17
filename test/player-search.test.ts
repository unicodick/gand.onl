import { describe, expect, it } from "vitest";
import { filterPlayers, normalizePlayerQuery } from "../src/lib/players";

const PLAYERS = [
  { id: 1, username: "Royalty72", username_lower: "royalty72" },
  { id: 2, username: "setunicode", username_lower: "setunicode" },
  { id: 3, username: "Dizerg", username_lower: "dizerg" },
];

describe("player search", () => {
  it("normalizes whitespace and case", () => {
    expect(normalizePlayerQuery("  RoYaL  ")).toBe("royal");
  });

  it("matches a case-insensitive username fragment", () => {
    expect(
      filterPlayers(PLAYERS, "TY7").map((player) => player.username),
    ).toEqual(["Royalty72"]);
    expect(
      filterPlayers(PLAYERS, "unicode").map((player) => player.username),
    ).toEqual(["setunicode"]);
  });

  it("keeps the original order for an empty query", () => {
    expect(filterPlayers(PLAYERS, "   ")).toEqual(PLAYERS);
  });

  it("returns an empty list when no username matches", () => {
    expect(filterPlayers(PLAYERS, "missing")).toEqual([]);
  });
});
