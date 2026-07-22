import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = ({ locals }) => {
  return json({ user: locals.user ?? null });
};
