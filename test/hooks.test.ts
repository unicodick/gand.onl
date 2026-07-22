import { describe, expect, it, vi } from "vitest";
import { handle } from "../src/hooks.server";

function requestEvent(pathname: string, method = "GET") {
  const url = new URL(pathname, "https://gand.onl");
  return {
    cookies: { get: () => undefined },
    locals: {},
    platform: undefined,
    request: new Request(url, { method }),
    url,
  };
}

describe("server response headers", () => {
  it.each([
    "/account",
    "/account/news",
    "/auth/discord/login",
    "/auth/discord/callback",
    "/api/me",
  ])("prevents caching private path %s", async (pathname) => {
    const response = await handle({
      event: requestEvent(pathname),
      resolve: async () => new Response("ok"),
    } as never);

    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it.each(["/", "/accounting", "/api/server-status"])(
    "preserves caching for public path %s",
    async (pathname) => {
      const response = await handle({
        event: requestEvent(pathname),
        resolve: async () =>
          new Response("ok", {
            headers: { "Cache-Control": "public, max-age=60" },
          }),
      } as never);

      expect(response.headers.get("Cache-Control")).toBe("public, max-age=60");
    },
  );

  it("marks an early unauthorized admin response as private", async () => {
    const resolve = vi.fn(async () => new Response("ok"));
    const response = await handle({
      event: requestEvent("/account/news", "POST"),
      resolve,
    } as never);

    expect(response.status).toBe(401);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(resolve).not.toHaveBeenCalled();
  });
});
