import { describe, expect, it } from "vitest";
import {
  MAX_PAGE,
  pageCount,
  pageOffset,
  parsePage,
} from "../src/lib/pagination";

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

describe("pagination metadata", () => {
  it("keeps empty collections on the first page", () => {
    expect(pageCount(0, 7)).toBe(1);
  });

  it("calculates page counts and offsets", () => {
    expect(pageCount(15, 7)).toBe(3);
    expect(pageOffset(3, 7)).toBe(14);
  });
});
