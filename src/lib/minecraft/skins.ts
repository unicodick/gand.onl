const SKIN_RENDER_BASE_URL = "https://nmsr.nickac.dev";

export function skinRender(username: string): string {
  return `${SKIN_RENDER_BASE_URL}/fullbody/${username}`;
}

export function skinFace(username: string): string {
  return `${SKIN_RENDER_BASE_URL}/face/${username}`;
}
