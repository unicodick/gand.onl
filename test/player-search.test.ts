import { describe, expect, it } from "vitest";
import {
  filterAdminPlayers,
  filterPlayers,
  normalizePlayerQuery,
} from "../src/lib/players/search";

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

describe("admin player filters", () => {
  const players = [
    { ...PLAYERS[0], owner_discord_id: "discord-1", blocked_at: null },
    { ...PLAYERS[1], owner_discord_id: null, blocked_at: null },
    {
      ...PLAYERS[2],
      owner_discord_id: "discord-2",
      blocked_at: "2026-07-17T00:00:00.000Z",
    },
  ];

  it("combines username search with status filters", () => {
    expect(filterAdminPlayers(players, "royal", "linked")).toEqual([
      players[0],
    ]);
    expect(filterAdminPlayers(players, "", "unlinked")).toEqual([players[1]]);
    expect(filterAdminPlayers(players, "", "blocked")).toEqual([players[2]]);
  });
});
