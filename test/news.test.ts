import { describe, expect, it } from "vitest";
import {
  MAX_NEWS_TAG_LENGTH,
  isNewsCoverKey,
  newsCoverUrl,
  normalizeNewsTags,
  parseNewsTags,
  validateNewsCover,
} from "../src/lib/news/model";

describe("news tags", () => {
  it("normalizes whitespace and removes case-insensitive duplicates", () => {
    expect(
      normalizeNewsTags(["  Обновление  ", "обновление", "Новый   сезон"]),
    ).toEqual(["Обновление", "Новый сезон"]);
  });

  it("limits tag count and length", () => {
    expect(
      normalizeNewsTags([
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "x".repeat(MAX_NEWS_TAG_LENGTH + 1),
      ]),
    ).toEqual(["one", "two", "three", "four", "five"]);
  });

  it("safely parses stored tag JSON", () => {
    expect(parseNewsTags('["Событие", 42, " Сервер "]')).toEqual([
      "Событие",
      "Сервер",
    ]);
    expect(parseNewsTags("broken")).toEqual([]);
  });
});

describe("news covers", () => {
  it("accepts supported images within the size limit", () => {
    const file = new File([new Uint8Array(32)], "cover.webp", {
      type: "image/webp",
    });
    expect(validateNewsCover(file)).toBeNull();
  });

  it("rejects empty and unsupported files", () => {
    expect(
      validateNewsCover(new File([], "empty.png", { type: "image/png" })),
    ).toBe("Выберите изображение");
    expect(
      validateNewsCover(
        new File(["image"], "cover.svg", { type: "image/svg+xml" }),
      ),
    ).toBe("Поддерживаются JPEG, PNG и WebP");
  });

  it("builds URLs only for generated cover keys", () => {
    const key = "2d931510-d99f-494a-8c67-87feb05e1594.webp";
    expect(isNewsCoverKey(key)).toBe(true);
    expect(newsCoverUrl(key)).toBe(`/media/news/${key}`);
    expect(newsCoverUrl("../secret.png")).toBeNull();
  });
});
