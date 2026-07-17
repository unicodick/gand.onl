import { describe, expect, it } from "vitest";
import { parseNewsForm } from "../src/lib/server/news-form";

const COVER_KEY = "2d931510-d99f-494a-8c67-87feb05e1594.webp";

function validForm(): FormData {
  const form = new FormData();
  form.set("title", " Большое обновление ");
  form.set("slug", "");
  form.set("body", " Текст новости ");
  form.set("cover_key", COVER_KEY);
  form.set("tags", '["Обновление", " Сервер "]');
  form.set("published", "on");
  return form;
}

describe("news form", () => {
  it("normalizes a valid editor submission", () => {
    expect(parseNewsForm(validForm())).toEqual({
      value: {
        title: "Большое обновление",
        slug: "большое-обновление",
        body: "Текст новости",
        coverKey: COVER_KEY,
        tags: ["Обновление", "Сервер"],
        published: true,
      },
      error: null,
    });
  });

  it("requires content and a generated cover key", () => {
    const missingBody = validForm();
    missingBody.set("body", "");
    expect(parseNewsForm(missingBody)).toEqual({
      value: null,
      error: "Заполните заголовок и текст",
    });

    const missingCover = validForm();
    missingCover.set("cover_key", "");
    expect(parseNewsForm(missingCover)).toEqual({
      value: null,
      error: "Добавьте основное изображение",
    });
  });
});
