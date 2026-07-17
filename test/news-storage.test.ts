import { applyD1Migrations, env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import {
  createNews,
  getNewsById,
  listPublishedNews,
  updateNews,
} from "../src/lib/server/news/repository";

describe("news storage", () => {
  it("returns only the requested latest published posts", async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

    for (let index = 1; index <= 5; index += 1) {
      await env.DB.prepare(
        `INSERT INTO news (
          slug, title, body, cover_key, tags, published, published_at,
          author_discord_id
        ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      )
        .bind(
          `post-${index}`,
          `Post ${index}`,
          "Body",
          "2d931510-d99f-494a-8c67-87feb05e1594.webp",
          '["Обновление"]',
          `2026-07-${String(index).padStart(2, "0")}T12:00:00.000Z`,
          "author",
        )
        .run();
    }
    await env.DB.prepare(
      `INSERT INTO news (slug, title, body, published, author_discord_id)
       VALUES ('draft', 'Draft', 'Body', 0, 'author')`,
    ).run();

    const news = await listPublishedNews(env.DB, { limit: 3 });

    expect(news.map((item) => item.slug)).toEqual([
      "post-5",
      "post-4",
      "post-3",
    ]);
    expect(news[0].tags).toEqual(["Обновление"]);
  });

  it("creates and updates cover and tag metadata", async () => {
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
    const firstCover = "2d931510-d99f-494a-8c67-87feb05e1594.webp";
    const secondCover = "28a22900-7c06-44af-b799-b579312b5677.png";

    const id = await createNews(env.DB, {
      slug: "new-post",
      title: "New post",
      body: "Body",
      coverKey: firstCover,
      tags: [" Обновление ", "обновление", "Сервер"],
      published: false,
      authorDiscordId: "author",
    });

    expect(await getNewsById(env.DB, id)).toMatchObject({
      cover_key: firstCover,
      tags: ["Обновление", "Сервер"],
      published: 0,
      published_at: null,
    });

    await updateNews(env.DB, id, {
      slug: "new-post",
      title: "Updated post",
      body: "Updated body",
      coverKey: secondCover,
      tags: ["Событие"],
      published: true,
    });

    expect(await getNewsById(env.DB, id)).toMatchObject({
      title: "Updated post",
      cover_key: secondCover,
      tags: ["Событие"],
      published: 1,
    });
    expect((await getNewsById(env.DB, id))?.published_at).not.toBeNull();
  });
});
