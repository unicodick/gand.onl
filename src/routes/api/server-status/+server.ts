import { json } from "@sveltejs/kit";
import { fetchServerStatus } from "$lib/server-status";
import type { RequestHandler } from "./$types";

export const prerender = false;

const SERVER_ADDRESS = "zlp.onl";

export const GET: RequestHandler = async ({ fetch }) => {
  const status = await fetchServerStatus(fetch, SERVER_ADDRESS);
  const cacheControl =
    status.state === "unavailable"
      ? "no-store"
      : "public, max-age=60, s-maxage=300, stale-while-revalidate=60";

  return json(status, { headers: { "Cache-Control": cacheControl } });
};
