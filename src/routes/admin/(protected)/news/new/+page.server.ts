import { fail, redirect } from "@sveltejs/kit";
import { createNews, isSlugConflictError } from "$lib/server/news";
import { slugify } from "$lib/slug";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, platform, locals }) => {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const slugInput = String(form.get("slug") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    const published = form.get("published") === "on";

    if (!title || !body) {
      return fail(400, { errorMessage: "Заполните заголовок и текст" });
    }

    const slug = slugify(slugInput || title);
    if (!slug)
      return fail(400, { errorMessage: "Не удалось сформировать slug" });

    try {
      await createNews(platform!.env.DB, {
        slug,
        title,
        body,
        published,
        authorDiscordId: locals.user!.discordId,
      });
    } catch (err) {
      if (isSlugConflictError(err)) {
        return fail(400, { errorMessage: "Такой slug уже занят" });
      }
      throw err;
    }

    redirect(303, "/admin");
  },
};
