import {
  CUSTOM_LINK_LABEL_MAX_LENGTH,
  CUSTOM_LINKS_MAX,
  isValidSocialUrl,
  LINK_SOCIAL_PLATFORMS,
  SOCIAL_PLATFORMS,
} from "./socials";

export const BIO_MAX_LENGTH = 260;

export interface EditablePlayerProfile {
  bio: string;
  skinUrl: string;
  socials: { platform: string; url: string }[];
}

export type PlayerProfileFormResult =
  | { ok: true; profile: EditablePlayerProfile }
  | { ok: false; errorMessage: string };

export function parsePlayerProfileForm(
  form: FormData,
): PlayerProfileFormResult {
  const bio = String(form.get("bio") ?? "").trim();
  if (bio.length > BIO_MAX_LENGTH) {
    return { ok: false, errorMessage: "Слишком длинное описание" };
  }

  const skinUrl = String(form.get("skin_url") ?? "").trim();
  if (skinUrl && !isValidSocialUrl(skinUrl)) {
    return {
      ok: false,
      errorMessage: "Ссылка на скин должна начинаться с http:// или https://",
    };
  }

  const socials: { platform: string; url: string }[] = [];
  for (const socialPlatform of LINK_SOCIAL_PLATFORMS) {
    const value = String(form.get(`social_${socialPlatform.id}`) ?? "").trim();
    if (!value) continue;
    if (!isValidSocialUrl(value)) {
      return {
        ok: false,
        errorMessage: `Ссылка ${socialPlatform.label} должна начинаться с http:// или https://`,
      };
    }
    socials.push({ platform: socialPlatform.id, url: value });
  }

  const customLabels = form
    .getAll("custom_label")
    .map((value) => String(value).trim());
  const customUrls = form
    .getAll("custom_url")
    .map((value) => String(value).trim());
  if (customLabels.length > CUSTOM_LINKS_MAX) {
    return { ok: false, errorMessage: "Слишком много своих ссылок" };
  }

  const reservedLabels = new Set(
    SOCIAL_PLATFORMS.flatMap((platform) => [platform.id, platform.label]).map(
      (value) => value.toLowerCase(),
    ),
  );
  for (let index = 0; index < customLabels.length; index++) {
    const label = customLabels[index];
    const url = customUrls[index] ?? "";
    if (!label && !url) continue;
    if (!label || !url) {
      return {
        ok: false,
        errorMessage: "Укажите и название, и ссылку для своей ссылки",
      };
    }
    if (label.length > CUSTOM_LINK_LABEL_MAX_LENGTH) {
      return { ok: false, errorMessage: "Слишком длинное название ссылки" };
    }
    if (reservedLabels.has(label.toLowerCase())) {
      return {
        ok: false,
        errorMessage: `"${label}" уже есть среди стандартных соцсетей`,
      };
    }
    if (!isValidSocialUrl(url)) {
      return {
        ok: false,
        errorMessage: `Ссылка ${label} должна начинаться с http:// или https://`,
      };
    }
    socials.push({ platform: label, url });
  }

  return { ok: true, profile: { bio, skinUrl, socials } };
}
