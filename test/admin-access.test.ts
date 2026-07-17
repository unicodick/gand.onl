import { describe, expect, it } from "vitest";
import { load as loadAdminOverview } from "../src/routes/account/(admin)/admin/+page.server";
import { load as loadAdminNews } from "../src/routes/account/(admin)/news/+page.server";
import { load as loadAdminNewsEditor } from "../src/routes/account/(admin)/news/[id]/edit/+page.server";
import { load as loadAdminPlayers } from "../src/routes/account/(admin)/players/+page.server";
import { load as loadAdminPlayerEditor } from "../src/routes/account/(admin)/players/[id]/edit/+page.server";

const protectedLoads = [
  loadAdminOverview,
  loadAdminNews,
  loadAdminNewsEditor,
  loadAdminPlayers,
  loadAdminPlayerEditor,
];

describe("admin page access", () => {
  it.each(protectedLoads)(
    "rejects an anonymous direct server load",
    async (load) => {
      await expect(
        load({
          locals: {},
          params: { id: "1" },
          platform: { env: { ADMIN_DISCORD_IDS: "admin-id" } },
        } as never),
      ).rejects.toMatchObject({ status: 403 });
    },
  );

  it.each(protectedLoads)(
    "rejects a non-admin direct server load",
    async (load) => {
      await expect(
        load({
          locals: { user: { discordId: "user-id", username: "user" } },
          params: { id: "1" },
          platform: { env: { ADMIN_DISCORD_IDS: "admin-id" } },
        } as never),
      ).rejects.toMatchObject({ status: 403 });
    },
  );
});
