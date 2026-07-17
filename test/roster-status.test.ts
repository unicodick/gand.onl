import { describe, expect, it } from "vitest";
import {
  getRosterFreshness,
  ROSTER_FRESH_FOR_MS,
} from "../src/lib/roster-status";

describe("Roster freshness", () => {
  const now = Date.parse("2026-07-17T12:00:00.000Z");

  it("distinguishes missing, recent and stale data", () => {
    expect(getRosterFreshness(null, now)).toBe("no_data");
    expect(getRosterFreshness("not-a-date", now)).toBe("no_data");
    expect(
      getRosterFreshness(
        new Date(now - ROSTER_FRESH_FOR_MS).toISOString(),
        now,
      ),
    ).toBe("recent");
    expect(
      getRosterFreshness(
        new Date(now - ROSTER_FRESH_FOR_MS - 1).toISOString(),
        now,
      ),
    ).toBe("stale");
  });
});
