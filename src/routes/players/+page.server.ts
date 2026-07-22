import { listAllPlayers, toPublicPlayer } from "$lib/server/players/repository";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  const players = await listAllPlayers(platform!.env.DB);
  return { players: players.map(toPublicPlayer) };
};
