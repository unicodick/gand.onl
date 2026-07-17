import { fail } from "@sveltejs/kit";
import { renderMarkdown } from "$lib/news/markdown";
import { parseNewsForm, prepareNewsFormCover } from "$lib/server/news-form";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const form = await request.formData();
    const coverError = await prepareNewsFormCover(
      form,
      platform!.env.NEWS_MEDIA,
    );
    if (coverError) return fail(400, { errorMessage: coverError });

    const parsed = parseNewsForm(form);
    if (!parsed.value) return fail(400, { errorMessage: parsed.error });

    const now = new Date().toISOString();
    const publishedAt = String(form.get("published_at") ?? "").trim() || now;
    const news = {
      id: 0,
      slug: parsed.value.slug,
      title: parsed.value.title,
      body: parsed.value.body,
      cover_key: parsed.value.coverKey,
      tags: parsed.value.tags,
      published: parsed.value.published ? 1 : 0,
      published_at: publishedAt,
      created_at: now,
      updated_at: now,
    };

    return {
      preview: { news, html: renderMarkdown(parsed.value.body) },
    };
  },
};
