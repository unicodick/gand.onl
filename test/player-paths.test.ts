import { describe, expect, it } from "vitest";
import { playerEditPath, playerProfilePath } from "../src/lib/players/paths";

describe("player paths", () => {
  it("builds canonical profile and edit paths", () => {
    expect(playerProfilePath("setunicode")).toBe("/@setunicode");
    expect(playerEditPath("setunicode")).toBe("/@setunicode/edit");
  });

  it("encodes unsafe path characters", () => {
    expect(playerProfilePath("player name")).toBe("/@player%20name");
  });
});
