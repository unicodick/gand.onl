import { describe, expect, it } from "vitest";
import {
  BIO_MAX_LENGTH,
  parsePlayerProfileForm,
} from "../src/lib/players/profile-form";

function form(entries: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      data.append(key, item);
    }
  }
  return data;
}

describe("player profile form", () => {
  it("parses editable fields and custom links", () => {
    expect(
      parsePlayerProfileForm(
        form({
          bio: " Bio ",
          skin_url: "https://example.com/skin.png",
          social_telegram: "https://t.me/player",
          custom_label: "Website",
          custom_url: "https://example.com",
        }),
      ),
    ).toEqual({
      ok: true,
      profile: {
        bio: "Bio",
        skinUrl: "https://example.com/skin.png",
        socials: [
          { platform: "telegram", url: "https://t.me/player" },
          { platform: "Website", url: "https://example.com" },
        ],
      },
    });
  });

  it("rejects invalid and reserved custom links", () => {
    expect(
      parsePlayerProfileForm(
        form({ custom_label: "Discord", custom_url: "https://example.com" }),
      ),
    ).toMatchObject({ ok: false });
    expect(
      parsePlayerProfileForm(form({ social_telegram: "javascript:alert(1)" })),
    ).toMatchObject({ ok: false });
  });

  it("accepts descriptions up to 260 characters", () => {
    expect(
      parsePlayerProfileForm(form({ bio: "x".repeat(BIO_MAX_LENGTH) })),
    ).toMatchObject({ ok: true });
  });

  it("rejects descriptions longer than 260 characters", () => {
    expect(
      parsePlayerProfileForm(form({ bio: "x".repeat(BIO_MAX_LENGTH + 1) })),
    ).toEqual({ ok: false, errorMessage: "Слишком длинное описание" });
  });
});
