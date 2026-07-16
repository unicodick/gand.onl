export interface Creator {
  name: string;
}

export interface Link {
  label: string;
  href: string;
}

export const CREATORS: Creator[] = [
  { name: "setunicode" },
  { name: "Royalty72" },
  { name: "Dizerg" },
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

export function skinRender(username: string): string {
  return `https://nmsr.nickac.dev/fullbody/${username}`;
}

export function skinFace(username: string): string {
  return `https://nmsr.nickac.dev/face/${username}`;
}
