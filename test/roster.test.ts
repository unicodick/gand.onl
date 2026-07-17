import { applyD1Migrations, env } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import { getRosterStatus, syncRoster } from "../src/lib/server/roster";

beforeEach(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM roster_status"),
    env.DB.prepare("DELETE FROM players"),
  ]);
});

describe("Roster status", () => {
  it("stores the latest deduplicated sync summary", async () => {
    const status = await syncRoster(env.DB, [" Player ", "player", "Another"]);

    expect(status).toMatchObject({ received_count: 2, added_count: 2 });
    await expect(getRosterStatus(env.DB)).resolves.toEqual(status);
  });

  it("counts only newly discovered players", async () => {
    await syncRoster(env.DB, ["Existing"]);
    const status = await syncRoster(env.DB, ["Existing", "NewPlayer"]);

    expect(status).toMatchObject({ received_count: 2, added_count: 1 });
  });
});
