export const PIXEL_ICON_NAMES = [
  "admin",
  "arrow-left",
  "arrow-right",
  "check",
  "close",
  "edit",
  "external-link",
  "file",
  "image",
  "link",
  "lock",
  "logout",
  "plus",
  "preview",
  "save",
  "search",
  "trash",
  "unlink",
  "unlock",
] as const;

export type PixelIconName = (typeof PIXEL_ICON_NAMES)[number];
