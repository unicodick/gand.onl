import { describe, expect, it } from "vitest";
import { MAX_PAGE, parsePage } from "../src/lib/pagination";

describe("parsePage", () => {
  it("uses the first page when the parameter is absent", () => {
    expect(parsePage(null)).toBe(1);
  });

  it.each([
    ["1", 1],
    ["42", 42],
    [String(MAX_PAGE), MAX_PAGE],
  ])("accepts page %s", (raw, expected) => {
    expect(parsePage(raw)).toBe(expected);
  });

  it.each(["", "0", "-1", "1.5", "nope", "1e308", String(MAX_PAGE + 1)])(
    "rejects page %s",
    (raw) => {
      expect(parsePage(raw)).toBeNull();
    },
  );
});
