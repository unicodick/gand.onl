<script lang="ts">
  import { untrack } from "svelte";
  import { BRAND } from "$lib/creators";
  import {
    CUSTOM_LINKS_MAX,
    DISCORD_PLATFORM_ID,
    LINK_SOCIAL_PLATFORMS,
    SOCIAL_PLATFORM_IDS,
  } from "$lib/socials";

  let { data, form } = $props();

  let bio = $state(untrack(() => data.player.bio ?? ""));
  let skinUrl = $state(untrack(() => data.player.skin_url ?? ""));
  let socialValues = $state(
    untrack(() =>
      Object.fromEntries(
        LINK_SOCIAL_PLATFORMS.map((platform) => [
          platform.id,
          data.socials.find((s) => s.platform === platform.id)?.url ?? "",
        ]),
      ),
    ),
  );
  let showDiscordProfile = $state(
    untrack(() =>
      data.socials.some((social) => social.platform === DISCORD_PLATFORM_ID),
    ),
  );
  let customLinks = $state(
    untrack(() =>
      data.socials
        .filter((s) => !SOCIAL_PLATFORM_IDS.includes(s.platform))
        .map((s) => ({
          key: crypto.randomUUID(),
          label: s.platform,
          url: s.url,
        })),
    ),
  );

  function addCustomLink() {
    customLinks.push({ key: crypto.randomUUID(), label: "", url: "" });
  }

  function removeCustomLink(key: string) {
    customLinks = customLinks.filter((link) => link.key !== key);
  }
</script>

<svelte:head>
  <title>Редактирование — {data.player.username} — {BRAND}</title>
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <div class="flex w-full max-w-2xl flex-col gap-6">
    <h1 class="text-sm text-neutral-100">
      Редактирование профиля — {data.player.username}
    </h1>

    <form method="POST" class="mc-panel panel-in flex flex-col gap-4 p-6">
      {#if form?.errorMessage}
        <p class="text-[10px] text-red-400">{form.errorMessage}</p>
      {/if}

      <label
        class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
      >
        О СЕБЕ
        <textarea
          name="bio"
          bind:value={bio}
          rows="10"
          maxlength="2000"
          class="mc-panel bg-transparent px-3 py-2 text-xs leading-relaxed text-neutral-100 outline-none"
        ></textarea>
      </label>

      <label
        class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
      >
        СКИН (ССЫЛКА НА КАРТИНКУ)
        <input
          name="skin_url"
          bind:value={skinUrl}
          placeholder="https://"
          class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
        />
      </label>

      <div class="flex flex-col gap-3">
        <p class="text-[10px] tracking-widest text-neutral-500">СОЦСЕТИ</p>
        <label
          class="mc-panel flex cursor-pointer items-start gap-3 p-4 text-[9px] leading-relaxed text-neutral-500"
        >
          <input
            type="checkbox"
            name="show_discord_profile"
            bind:checked={showDiscordProfile}
            class="peer sr-only"
          />
          <span
            class="mt-0.5 size-4 shrink-0 bg-neutral-700 shadow-[inset_1px_1px_0_#000,inset_-1px_-1px_0_#3f3f46] peer-checked:bg-grass peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grass"
            aria-hidden="true"
          ></span>
          <span class="space-y-1">
            <span class="block tracking-widest text-neutral-300">
              ПОКАЗЫВАТЬ DISCORD-ПРОФИЛЬ
            </span>
            <span class="block text-[8px] leading-relaxed text-neutral-600">
              Аватар и имя берутся из привязанного Discord-аккаунта. Статус и
              активность не публикуются.
            </span>
          </span>
        </label>

        {#each LINK_SOCIAL_PLATFORMS as platform (platform.id)}
          <label
            class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
          >
            {platform.label.toUpperCase()}
            <input
              name={`social_${platform.id}`}
              bind:value={socialValues[platform.id]}
              placeholder="https://"
              class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
            />
          </label>
        {/each}
      </div>

      <div class="flex flex-col gap-3">
        <p class="text-[10px] tracking-widest text-neutral-500">СВОИ ССЫЛКИ</p>
        {#each customLinks as link (link.key)}
          <div class="flex gap-2">
            <input
              name="custom_label"
              bind:value={link.label}
              placeholder="Название"
              maxlength="30"
              class="mc-panel w-32 shrink-0 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
            />
            <input
              name="custom_url"
              bind:value={link.url}
              placeholder="https://"
              class="mc-panel min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
            />
            <button
              type="button"
              onclick={() => removeCustomLink(link.key)}
              class="mc-panel mc-tab px-3 py-2 text-[10px] tracking-widest text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        {/each}
        {#if customLinks.length < CUSTOM_LINKS_MAX}
          <button
            type="button"
            onclick={addCustomLink}
            class="mc-panel mc-tab px-3 py-2 text-[10px] tracking-widest text-neutral-300 hover:text-white"
          >
            + ДОБАВИТЬ ССЫЛКУ
          </button>
        {/if}
      </div>

      <button
        type="submit"
        class="mc-panel mc-tab px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
      >
        Сохранить
      </button>
    </form>
  </div>
</main>
