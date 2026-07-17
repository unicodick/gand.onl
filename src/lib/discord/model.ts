export interface PublicDiscordProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
}

export function discordAvatarUrl(
  discordId: string,
  avatarHash: string | null,
): string {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=128`;
  }

  const defaultAvatar = (BigInt(discordId) >> 22n) % 6n;
  return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
}

export function discordProfileUrl(discordId: string): string {
  return `https://discord.com/users/${discordId}`;
}

export function canPreserveDiscordVisibility(
  currentOwnerDiscordId: string | null,
  nextOwnerDiscordId: string | null,
): boolean {
  return Boolean(
    currentOwnerDiscordId && currentOwnerDiscordId === nextOwnerDiscordId,
  );
}
