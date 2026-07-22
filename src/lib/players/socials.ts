export interface SocialPlatform {
  id: string;
  label: string;
}

export const DISCORD_PLATFORM_ID = "discord";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: DISCORD_PLATFORM_ID, label: "Discord" },
  { id: "telegram", label: "Telegram" },
  { id: "eblo", label: "eblo.id" },
];

export const LINK_SOCIAL_PLATFORMS = SOCIAL_PLATFORMS.filter(
  (platform) => platform.id !== DISCORD_PLATFORM_ID,
);

export const SOCIAL_PLATFORM_IDS = SOCIAL_PLATFORMS.map((p) => p.id);

export const CUSTOM_LINKS_MAX = 5;
export const CUSTOM_LINK_LABEL_MAX_LENGTH = 30;

export function isValidSocialUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
