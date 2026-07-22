const SKIN_RENDER_BASE_URL = "https://nmsr.nickac.dev";

export function isSecureSkinUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function skinRender(username: string): string {
  return `${SKIN_RENDER_BASE_URL}/fullbody/${username}`;
}

export function skinFace(username: string): string {
  return `${SKIN_RENDER_BASE_URL}/face/${username}`;
}

export function playerSkin(
  username: string,
  customSkinUrl: string | null,
): string {
  return customSkinUrl && isSecureSkinUrl(customSkinUrl)
    ? customSkinUrl
    : skinRender(username);
}
