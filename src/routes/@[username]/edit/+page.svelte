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

<main class="flex w-full flex-1 flex-col items-center px-4 py-10 sm:py-16">
  <div class="w-full max-w-4xl space-y-6">
    <header class="space-y-4">
      <a
        href={playerProfilePath(data.player.username)}
        class="inline-block text-[8px] tracking-widest text-neutral-600 hover:text-neutral-300"
      >
        ← ВЕРНУТЬСЯ В ПРОФИЛЬ
      </a>
      <div class="space-y-2">
        <p class="text-[8px] tracking-[0.22em] text-neutral-600">
          РЕДАКТОР ПРОФИЛЯ
        </p>
        <h1 class="break-all text-lg text-neutral-100 sm:text-2xl">
          <span class="text-neutral-600">@</span>{data.player.username}
        </h1>
      </div>
    </header>

    {#if form?.errorMessage}
      <p
        class="mc-panel border-l-2 border-l-red-500 p-4 text-[9px] leading-relaxed text-red-300"
        role="alert"
      >
        {form.errorMessage}
      </p>
    {/if}

    <form method="POST" class="space-y-4">
      <section class="mc-panel panel-in space-y-5 p-5 sm:p-6">
        <div class="space-y-1">
          <p class="text-[9px] tracking-widest text-neutral-200">О ПРОФИЛЕ</p>
          <p class="text-[8px] leading-relaxed text-neutral-600">
            Описание и изображение, которые видны на публичной странице.
          </p>
        </div>

        <label
          class="flex flex-col gap-2 text-[8px] tracking-widest text-neutral-500"
        >
          О СЕБЕ
          <textarea
            name="bio"
            bind:value={bio}
            rows="8"
            maxlength="2000"
            placeholder="Расскажи немного о себе"
            class="mc-panel min-h-40 resize-y bg-transparent px-4 py-3 text-[10px] leading-loose tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:shadow-[inset_0_0_0_1px_var(--color-grass-dim),0_0_0_3px_#000] sm:text-xs"
          ></textarea>
          <span class="text-right text-[7px] text-neutral-700">
            {bio.length} / 2000
          </span>
        </label>

        <label
          class="flex flex-col gap-2 text-[8px] tracking-widest text-neutral-500"
        >
          СКИН — ССЫЛКА НА ИЗОБРАЖЕНИЕ
          <input
            name="skin_url"
            bind:value={skinUrl}
            type="url"
            placeholder="https://"
            class="mc-panel bg-transparent px-4 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:shadow-[inset_0_0_0_1px_var(--color-grass-dim),0_0_0_3px_#000] sm:text-xs"
          />
          <span class="text-[7px] leading-relaxed text-neutral-700">
            Оставь поле пустым, чтобы использовать актуальный скин по нику.
          </span>
        </label>
      </section>

      <section class="mc-panel space-y-5 p-5 sm:p-6">
        <div class="space-y-1">
          <p class="text-[9px] tracking-widest text-neutral-200">DISCORD</p>
          <p class="text-[8px] leading-relaxed text-neutral-600">
            Можно показать мини-карточку привязанного аккаунта без RPC.
          </p>
        </div>

        <label
          class="flex cursor-pointer items-start gap-4 border border-white/8 bg-white/2 p-4"
        >
          <input
            type="checkbox"
            name="show_discord_profile"
            bind:checked={showDiscordProfile}
            class="peer sr-only"
          />
          <span
            class="grid size-5 shrink-0 place-items-center bg-neutral-800 text-[10px] text-transparent shadow-[inset_2px_2px_0_#000,inset_-1px_-1px_0_#52525b] peer-checked:bg-grass peer-checked:text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grass"
            aria-hidden="true"
          >
            ✓
          </span>
          <span class="min-w-0 space-y-2">
            <span class="block text-[8px] tracking-widest text-neutral-300">
              ПОКАЗЫВАТЬ DISCORD-ПРОФИЛЬ
            </span>
            <span class="block text-[7px] leading-loose text-neutral-600">
              Публикуются только аватар, отображаемое имя и ссылка на профиль.
              Онлайн-статус и активность не запрашиваются.
            </span>
          </span>
        </label>
      </section>

      <section class="mc-panel space-y-5 p-5 sm:p-6">
        <div class="space-y-1">
          <p class="text-[9px] tracking-widest text-neutral-200">ССЫЛКИ</p>
          <p class="text-[8px] leading-relaxed text-neutral-600">
            Соцсети и до {CUSTOM_LINKS_MAX} произвольных ссылок.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          {#each LINK_SOCIAL_PLATFORMS as platform (platform.id)}
            <label
              class="flex min-w-0 flex-col gap-2 text-[8px] tracking-widest text-neutral-500"
            >
              {platform.label.toUpperCase()}
              <input
                name={`social_${platform.id}`}
                bind:value={socialValues[platform.id]}
                type="url"
                placeholder="https://"
                class="mc-panel min-w-0 bg-transparent px-4 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:text-neutral-700 focus:shadow-[inset_0_0_0_1px_var(--color-grass-dim),0_0_0_3px_#000]"
              />
            </label>
          {/each}
        </div>

        <div class="space-y-3 border-t border-white/8 pt-5">
          <div class="flex items-center justify-between gap-4">
            <p class="text-[8px] tracking-widest text-neutral-500">
              СВОИ ССЫЛКИ
            </p>
            <p class="text-[7px] text-neutral-700">
              {customLinks.length} / {CUSTOM_LINKS_MAX}
            </p>
          </div>

          {#each customLinks as link (link.key)}
            <div class="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto]">
              <input
                name="custom_label"
                bind:value={link.label}
                placeholder="Название"
                maxlength="30"
                aria-label="Название ссылки"
                class="mc-panel min-w-0 bg-transparent px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700"
              />
              <input
                name="custom_url"
                bind:value={link.url}
                type="url"
                placeholder="https://"
                aria-label="Адрес ссылки"
                class="mc-panel min-w-0 bg-transparent px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700"
              />
              <button
                type="button"
                onclick={() => removeCustomLink(link.key)}
                class="mc-tab px-3 py-2 text-[8px] tracking-widest text-red-500 hover:text-red-300"
                aria-label={`Удалить ссылку ${link.label || "без названия"}`}
              >
                УДАЛИТЬ
              </button>
            </div>
          {/each}

          {#if customLinks.length < CUSTOM_LINKS_MAX}
            <button
              type="button"
              onclick={addCustomLink}
              class="mc-tab border border-white/8 px-3 py-3 text-[8px] tracking-widest text-neutral-500 hover:text-white"
            >
              + ДОБАВИТЬ ССЫЛКУ
            </button>
          {/if}
        </div>
      </section>

      <footer
        class="mc-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <a
          href={playerProfilePath(data.player.username)}
          class="mc-tab px-4 py-3 text-center text-[8px] tracking-widest text-neutral-500 hover:text-white"
        >
          ОТМЕНА
        </a>
        <button
          type="submit"
          class="mc-tab border border-grass-dim/50 bg-grass-dim/10 px-5 py-3 text-[8px] tracking-widest text-grass hover:text-white"
        >
          СОХРАНИТЬ ПРОФИЛЬ
        </button>
      </footer>
    </form>
  </div>
</main>
