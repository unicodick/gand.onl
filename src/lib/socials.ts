export interface SocialPlatform {
  id: string;
  label: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "discord", label: "Discord" },
  { id: "telegram", label: "Telegram" },
  { id: "youtube", label: "YouTube" },
  { id: "twitch", label: "Twitch" },
  { id: "steam", label: "Steam" },
  { id: "x", label: "X" },
  { id: "github", label: "GitHub" },
];

export const SOCIAL_PLATFORM_IDS = SOCIAL_PLATFORMS.map((p) => p.id);

export function isValidSocialUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
