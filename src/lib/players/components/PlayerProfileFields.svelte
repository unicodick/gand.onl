<script lang="ts">
  import { untrack } from "svelte";
  import { BIO_MAX_LENGTH } from "$lib/players/profile-form";

  let {
    initialBio = null,
    initialSkinUrl = null,
    bioPlaceholder,
    skinHint,
  }: {
    initialBio?: string | null;
    initialSkinUrl?: string | null;
    bioPlaceholder?: string;
    skinHint?: string;
  } = $props();

  let bio = $state(untrack(() => initialBio ?? ""));
  let skinUrl = $state(untrack(() => initialSkinUrl ?? ""));
</script>

<label class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500">
  О СЕБЕ
  <textarea
    name="bio"
    bind:value={bio}
    rows="8"
    maxlength={BIO_MAX_LENGTH}
    placeholder={bioPlaceholder}
    class="min-h-40 resize-y border border-white/10 bg-black/20 px-3 py-3 text-[10px] leading-loose tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim sm:text-xs"
  ></textarea>
  <span class="text-right text-[8px] text-neutral-600">
    {bio.length}/{BIO_MAX_LENGTH}
  </span>
</label>

<label class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500">
  СКИН — ССЫЛКА НА ИЗОБРАЖЕНИЕ
  <input
    name="skin_url"
    bind:value={skinUrl}
    type="url"
    placeholder="https://"
    class="border border-white/10 bg-black/20 px-3 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim sm:text-xs"
  />
  {#if skinHint}
    <span class="text-[8px] leading-relaxed text-neutral-600">
      {skinHint}
    </span>
  {/if}
</label>
