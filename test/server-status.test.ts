import { describe, expect, it, vi } from "vitest";
import {
  fetchServerStatus,
  parseMcsrvstatResponse,
} from "../src/lib/minecraft/server-status";

describe("server status", () => {
  it("maps online, offline, and malformed responses", () => {
    expect(
      parseMcsrvstatResponse({ online: true, players: { online: 12 } }),
    ).toEqual({ state: "online", players: 12 });
    expect(parseMcsrvstatResponse({ online: true })).toEqual({
      state: "online",
      players: null,
    });
    expect(parseMcsrvstatResponse({ online: false })).toEqual({
      state: "offline",
      players: null,
    });
    expect(parseMcsrvstatResponse({ online: "yes" })).toEqual({
      state: "unavailable",
      players: null,
    });
  });

  it("sends a descriptive user agent to the v3 endpoint", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({ online: true, players: { online: 4 } }),
    );

    await expect(fetchServerStatus(fetcher, "zlp.onl")).resolves.toEqual({
      state: "online",
      players: 4,
    });
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.mcsrvstat.us/3/zlp.onl",
      expect.objectContaining({
        headers: expect.objectContaining({
          "User-Agent": expect.stringContaining("gand.onl"),
        }),
      }),
    );
  });

  it("does not report upstream failures as an offline server", async () => {
    const failedResponse = vi.fn(
      async () => new Response(null, { status: 503 }),
    );
    const failedRequest = vi.fn(async () => {
      throw new Error("network unavailable");
    });

    await expect(fetchServerStatus(failedResponse, "zlp.onl")).resolves.toEqual(
      { state: "unavailable", players: null },
    );
    await expect(fetchServerStatus(failedRequest, "zlp.onl")).resolves.toEqual({
      state: "unavailable",
      players: null,
    });
  });
});
