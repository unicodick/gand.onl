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

<label class="flex flex-col gap-2 text-[10px] tracking-widest text-neutral-400">
  О СЕБЕ
  <textarea
    name="bio"
    bind:value={bio}
    rows="8"
    maxlength={BIO_MAX_LENGTH}
    placeholder={bioPlaceholder}
    class="min-h-40 resize-y border border-white/10 bg-black/20 px-3 py-3 text-[10px] leading-loose tracking-normal text-neutral-100 outline-none placeholder:text-neutral-400 focus:border-grass-dim sm:text-xs"
  ></textarea>
  <span class="text-right text-[10px] text-neutral-400">
    {bio.length}/{BIO_MAX_LENGTH}
  </span>
</label>

<label class="flex flex-col gap-2 text-[10px] tracking-widest text-neutral-400">
  СКИН — ССЫЛКА НА ИЗОБРАЖЕНИЕ
  <input
    name="skin_url"
    bind:value={skinUrl}
    type="url"
    placeholder="https://"
    class="border border-white/10 bg-black/20 px-3 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:text-neutral-400 focus:border-grass-dim sm:text-xs"
  />
  {#if skinHint}
    <span class="text-[10px] leading-relaxed text-neutral-400">
      {skinHint}
    </span>
  {/if}
</label>
