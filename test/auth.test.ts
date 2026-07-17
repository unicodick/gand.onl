import { describe, expect, it } from "vitest";
import { requireModAuthorization } from "../src/lib/server/auth/guards";
import { safeRedirectTarget } from "../src/lib/server/auth/oauth";

const ORIGIN = "https://gand.onl";

describe("safeRedirectTarget", () => {
  it.each([
    ["/account", "/account"],
    ["/@player/edit?tab=links#socials", "/@player/edit?tab=links#socials"],
  ])("accepts same-origin path %s", (raw, expected) => {
    expect(safeRedirectTarget(raw, ORIGIN)).toBe(expected);
  });

  it.each([
    null,
    "account",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
  ])("rejects unsafe target %s", (raw) => {
    expect(safeRedirectTarget(raw, ORIGIN)).toBeNull();
  });
});

describe("requireModAuthorization", () => {
  it("accepts the configured bearer token", () => {
    const request = new Request("https://gand.onl/api/mod/roster", {
      headers: { Authorization: "Bearer configured-secret" },
    });

    expect(() =>
      requireModAuthorization(request, "configured-secret"),
    ).not.toThrow();
  });

  it("rejects an incorrect bearer token", () => {
    const request = new Request("https://gand.onl/api/mod/roster", {
      headers: { Authorization: "Bearer incorrect-secret" },
    });

    expect(() => requireModAuthorization(request, "configured-secret")).toThrow(
      expect.objectContaining({ status: 401 }),
    );
  });

  it.each([undefined, "", "   "])(
    "fails closed when the mod secret is not configured",
    (secret) => {
      const request = new Request("https://gand.onl/api/mod/roster", {
        headers: { Authorization: `Bearer ${secret ?? ""}` },
      });

      expect(() => requireModAuthorization(request, secret as string)).toThrow(
        expect.objectContaining({ status: 503 }),
      );
    },
  );
});
