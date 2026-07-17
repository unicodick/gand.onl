import { describe, expect, it } from "vitest";
import { safeRedirectTarget } from "../src/lib/server/auth";

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
