import { error } from "@sveltejs/kit";
import type { SessionUser } from "./sessions";

export function isAllowedAdmin(
  env: App.Platform["env"],
  discordId: string,
): boolean {
  return env.ADMIN_DISCORD_IDS.split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(discordId);
}

export function requireAdmin(
  env: App.Platform["env"],
  user: SessionUser | undefined,
): SessionUser {
  if (!user || !isAllowedAdmin(env, user.discordId)) {
    error(403, "Недостаточно прав");
  }
  return user;
}

export function requireModAuthorization(
  request: Request,
  secret: string,
): void {
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    error(401, "Unauthorized");
  }
}
