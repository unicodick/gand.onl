<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import {
    CUSTOM_LINKS_MAX,
    LINK_SOCIAL_PLATFORMS,
    SOCIAL_PLATFORM_IDS,
  } from "$lib/players/socials";

  let {
    socials,
    children,
    addButtonClass = "text-neutral-500 hover:text-white",
  }: {
    socials: { platform: string; url: string }[];
    children?: Snippet;
    addButtonClass?: string;
  } = $props();

  let socialValues = $state(
    untrack(() =>
      Object.fromEntries(
        LINK_SOCIAL_PLATFORMS.map((platform) => [
          platform.id,
          socials.find((social) => social.platform === platform.id)?.url ?? "",
        ]),
      ),
    ),
  );
  let customLinks = $state(
    untrack(() =>
      socials
        .filter((social) => !SOCIAL_PLATFORM_IDS.includes(social.platform))
        .map((social) => ({
          key: crypto.randomUUID(),
          label: social.platform,
          url: social.url,
        })),
    ),
  );

  function addCustomLink(): void {
    customLinks.push({ key: crypto.randomUUID(), label: "", url: "" });
  }

  function removeCustomLink(key: string): void {
    customLinks = customLinks.filter((link) => link.key !== key);
  }
</script>

<div class="space-y-4 border-t border-white/5 pt-5">
  <p class="text-[9px] tracking-widest text-neutral-500">ССЫЛКИ</p>

  {@render children?.()}

  <div class="grid gap-4 sm:grid-cols-2">
    {#each LINK_SOCIAL_PLATFORMS as platform (platform.id)}
      <label
        class="flex min-w-0 flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
      >
        {platform.label.toUpperCase()}
        <input
          name={`social_${platform.id}`}
          bind:value={socialValues[platform.id]}
          type="url"
          placeholder="https://"
          class="min-w-0 border border-white/10 bg-black/20 px-3 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim"
        />
      </label>
    {/each}
  </div>

  <div class="space-y-3">
    <div class="flex items-center justify-between gap-4">
      <p class="text-[9px] tracking-widest text-neutral-500">СВОИ ССЫЛКИ</p>
      <span class="text-[8px] text-neutral-600">
        {customLinks.length}/{CUSTOM_LINKS_MAX}
      </span>
    </div>

    {#each customLinks as link (link.key)}
      <div class="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_auto]">
        <input
          name="custom_label"
          bind:value={link.label}
          placeholder="Название"
          maxlength="30"
          aria-label="Название ссылки"
          class="min-w-0 border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim"
        />
        <input
          name="custom_url"
          bind:value={link.url}
          type="url"
          placeholder="https://"
          aria-label="Адрес ссылки"
          class="min-w-0 border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim"
        />
        <button
          type="button"
          onclick={() => removeCustomLink(link.key)}
          class="mc-tab grid min-h-9 place-items-center px-3 py-2 text-red-400 hover:text-red-300"
          aria-label={`Удалить ссылку ${link.label || "без названия"}`}
        >
          <PixelIcon name="close" size={10} />
        </button>
      </div>
    {/each}

    {#if customLinks.length < CUSTOM_LINKS_MAX}
      <button
        type="button"
        onclick={addCustomLink}
        class="mc-tab inline-flex items-center gap-2 px-3 py-2 text-[9px] tracking-widest {addButtonClass}"
      >
        <PixelIcon name="plus" size={10} />
        ДОБАВИТЬ ССЫЛКУ
      </button>
    {/if}
  </div>
</div>
