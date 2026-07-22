import { describe, expect, it } from "vitest";
import { playerProfilePath } from "../src/lib/players/paths";

describe("player paths", () => {
  it("builds canonical profile paths", () => {
    expect(playerProfilePath("setunicode")).toBe("/@setunicode");
  });

  it("encodes unsafe path characters", () => {
    expect(playerProfilePath("player name")).toBe("/@player%20name");
  });
});
