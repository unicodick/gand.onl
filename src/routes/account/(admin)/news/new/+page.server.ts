import { fail, redirect } from "@sveltejs/kit";
import { createNews, isSlugConflictError } from "$lib/server/news";
import {
  parseNewsForm,
  prepareNewsFormCover,
  readNewsFormValues,
} from "$lib/server/news-form";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, platform, locals }) => {
    const form = await request.formData();
    const coverError = await prepareNewsFormCover(
      form,
      platform!.env.NEWS_MEDIA,
    );
    if (coverError) {
      return fail(400, {
        errorMessage: coverError,
        values: readNewsFormValues(form),
      });
    }

    const parsed = parseNewsForm(form);
    if (!parsed.value) {
      return fail(400, {
        errorMessage: parsed.error,
        values: readNewsFormValues(form),
      });
    }
    const input = parsed.value;

    try {
      await createNews(platform!.env.DB, {
        ...input,
        authorDiscordId: locals.user!.discordId,
      });
    } catch (err) {
      if (isSlugConflictError(err)) {
        return fail(400, {
          errorMessage: "Такой slug уже занят",
          values: readNewsFormValues(form),
        });
      }
      throw err;
    }

    redirect(303, "/account/news");
  },
};
