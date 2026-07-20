import { applyD1Migrations, env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { load } from "../src/routes/news/+page.server";

async function insertPublishedNews(count: number): Promise<void> {
  for (let index = 1; index <= count; index += 1) {
    await env.DB.prepare(
      `INSERT INTO news (slug, title, body, published, published_at, author_discord_id)
       VALUES (?, ?, 'Body', 1, ?, 'author')`,
    )
      .bind(
        `post-${index}`,
        `Post ${index}`,
        `2026-07-${String(index).padStart(2, "0")}T12:00:00.000Z`,
      )
      .run();
  }
}

describe("public news page", () => {
  it("returns the requested published news page", async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
    await insertPublishedNews(8);

    const result = await load({
      platform: { env },
      url: new URL("https://gand.onl/news?page=2"),
    } as never);

    expect(result).toMatchObject({
      page: 2,
      pageCount: 2,
      total: 8,
    });
    if (!result) throw new Error("Expected page data");
    expect(result.items.map((item: { slug: string }) => item.slug)).toEqual([
      "post-1",
    ]);
  });

  it("rejects invalid and unavailable page numbers", async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

    await expect(
      load({
        platform: { env },
        url: new URL("https://gand.onl/news?page=0"),
      } as never),
    ).rejects.toMatchObject({ status: 404 });

    await expect(
      load({
        platform: { env },
        url: new URL("https://gand.onl/news?page=3"),
      } as never),
    ).rejects.toMatchObject({ status: 404 });
  });
});
