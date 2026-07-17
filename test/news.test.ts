import { describe, expect, it } from "vitest";
import {
  MAX_NEWS_TAG_LENGTH,
  normalizeNewsTags,
  parseNewsTags,
} from "../src/lib/news";

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
