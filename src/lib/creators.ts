export interface Creator {
  name: string;
  uuid: string;
}

export interface Link {
  label: string;
  href: string;
}

export const CREATORS: Creator[] = [
  { name: "setunicode", uuid: "6d43a6cecdcd4e638a905cecf2e71150" },
  { name: "Royalty72", uuid: "33407936318b46229a554d8ed5348943" },
  { name: "Dizerg", uuid: "168fc919-2043-46cf-bef5-0f5e2a907498" },
];

export const BRAND = "gand.onl";

export const LINKS = [
  { label: "zlp.onl", href: "https://zlp.onl" },
  { label: "telegram", href: "https://t.me/zalupaonline" },
  { label: "discord", href: "https://discord.gg/V5pHdX6VK6" },
] satisfies Link[];

export const CONTACT_LINKS = [
  { label: "discord", href: "https://discord.com/users/606522922240180249" },
  { label: "github", href: "https://github.com/unicodick/gand.onl" },
] satisfies Link[];

export const API_LINKS = [
  { label: "NMSR", href: "https://nmsr.nickac.dev" },
] satisfies Link[];

export function skinRender(uuid: string): string {
  return `https://nmsr.nickac.dev/fullbody/${uuid}`;
}
