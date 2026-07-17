<script lang="ts">
  import { untrack } from "svelte";
  import { BRAND } from "$lib/creators";
  import { playerProfilePath } from "$lib/player-paths";
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
  <title>Редактирование @{data.player.username} — {BRAND}</title>
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <div class="w-full max-w-2xl space-y-6">
    <header class="space-y-3">
      <a
        href={playerProfilePath(data.player.username)}
        class="inline-block text-[9px] tracking-widest text-neutral-500 hover:text-neutral-200"
      >
        ← ПРОФИЛЬ
      </a>
      <h1 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Редактирование @{data.player.username}
      </h1>
    </header>

    <form
      method="POST"
      class="mc-panel panel-in flex flex-col gap-5 p-5 sm:p-6"
    >
      {#if form?.errorMessage}
        <p
          class="border-l-2 border-l-red-500 bg-red-500/5 p-3 text-[9px] leading-relaxed text-red-300"
          role="alert"
        >
          {form.errorMessage}
        </p>
      {/if}

      <label
        class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
      >
        О СЕБЕ
        <textarea
          name="bio"
          bind:value={bio}
          rows="8"
          maxlength="2000"
          placeholder="Расскажи немного о себе"
          class="min-h-40 resize-y border border-white/10 bg-black/20 px-3 py-3 text-[10px] leading-loose tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim sm:text-xs"
        ></textarea>
        <span class="text-right text-[8px] text-neutral-600">
          {bio.length}/2000
        </span>
      </label>

      <label
        class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
      >
        СКИН — ССЫЛКА НА ИЗОБРАЖЕНИЕ
        <input
          name="skin_url"
          bind:value={skinUrl}
          type="url"
          placeholder="https://"
          class="border border-white/10 bg-black/20 px-3 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim sm:text-xs"
        />
        <span class="text-[8px] leading-relaxed text-neutral-600">
          Пустое поле — актуальный скин по нику.
        </span>
      </label>

      <div class="space-y-3 border-t border-white/5 pt-5">
        <p class="text-[9px] tracking-widest text-neutral-500">DISCORD</p>
        <label class="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="show_discord_profile"
            bind:checked={showDiscordProfile}
            class="peer sr-only"
          />
          <span
            class="grid size-4 shrink-0 place-items-center bg-neutral-800 text-[9px] text-transparent shadow-[inset_1px_1px_0_#000,inset_-1px_-1px_0_#52525b] peer-checked:bg-grass peer-checked:text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grass"
            aria-hidden="true"
          >
            ✓
          </span>
          <span class="space-y-1">
            <span class="block text-[9px] tracking-widest text-neutral-300">
              ПОКАЗЫВАТЬ ПРОФИЛЬ
            </span>
            <span class="block text-[8px] leading-relaxed text-neutral-600">
              Только аватар, имя и ссылка. Без статуса и активности.
            </span>
          </span>
        </label>
      </div>

      <div class="space-y-4 border-t border-white/5 pt-5">
        <p class="text-[9px] tracking-widest text-neutral-500">ССЫЛКИ</p>

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
            <p class="text-[9px] tracking-widest text-neutral-500">
              СВОИ ССЫЛКИ
            </p>
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
                class="mc-tab px-3 py-2 text-[9px] text-red-400 hover:text-red-300"
                aria-label={`Удалить ссылку ${link.label || "без названия"}`}
              >
                ×
              </button>
            </div>
          {/each}

          {#if customLinks.length < CUSTOM_LINKS_MAX}
            <button
              type="button"
              onclick={addCustomLink}
              class="mc-tab px-3 py-2 text-[9px] tracking-widest text-neutral-500 hover:text-white"
            >
              + ДОБАВИТЬ ССЫЛКУ
            </button>
          {/if}
        </div>
      </div>

      <div
        class="flex flex-col gap-2 border-t border-white/5 pt-5 sm:flex-row sm:justify-end"
      >
        <a
          href={playerProfilePath(data.player.username)}
          class="mc-tab px-4 py-3 text-center text-[9px] tracking-widest"
        >
          ОТМЕНА
        </a>
        <button
          type="submit"
          class="mc-tab px-4 py-3 text-[9px] tracking-widest text-neutral-200 hover:text-white"
        >
          СОХРАНИТЬ
        </button>
      </div>
    </form>
  </div>
</main>
