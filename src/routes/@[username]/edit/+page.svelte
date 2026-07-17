<script lang="ts">
  import { untrack } from "svelte";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import { BRAND } from "$lib/site";
  import { playerProfilePath } from "$lib/players/paths";
  import PlayerProfileFields from "$lib/players/components/PlayerProfileFields.svelte";
  import SocialLinksEditor from "$lib/players/components/SocialLinksEditor.svelte";
  import { DISCORD_PLATFORM_ID } from "$lib/players/socials";

  let { data, form } = $props();

  let showDiscordProfile = $state(
    untrack(() =>
      data.socials.some((social) => social.platform === DISCORD_PLATFORM_ID),
    ),
  );
</script>

<svelte:head>
  <title>Редактирование @{data.player.username} — {BRAND}</title>
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <div class="w-full max-w-2xl space-y-6">
    <header class="space-y-3">
      <a
        href={playerProfilePath(data.player.username)}
        class="inline-flex items-center gap-2 text-[9px] tracking-widest text-neutral-500 hover:text-neutral-200"
      >
        <PixelIcon name="arrow-left" size={11} />
        ПРОФИЛЬ
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

      <PlayerProfileFields
        initialBio={data.player.bio}
        initialSkinUrl={data.player.skin_url}
        bioPlaceholder="Расскажи немного о себе"
        skinHint="Пустое поле — актуальный скин по нику."
      />

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
            class="grid size-4 shrink-0 place-items-center bg-neutral-800 text-transparent shadow-[inset_1px_1px_0_#000,inset_-1px_-1px_0_#52525b] peer-checked:bg-grass peer-checked:text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grass"
            aria-hidden="true"
          >
            <PixelIcon name="check" size={9} />
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

      <SocialLinksEditor socials={data.socials} />

      <div
        class="flex flex-col gap-2 border-t border-white/5 pt-5 sm:flex-row sm:justify-end"
      >
        <a
          href={playerProfilePath(data.player.username)}
          class="mc-tab inline-flex items-center justify-center gap-2 px-4 py-3 text-center text-[9px] tracking-widest"
        >
          <PixelIcon name="close" size={10} />
          ОТМЕНА
        </a>
        <button
          type="submit"
          class="mc-tab inline-flex items-center justify-center gap-2 px-4 py-3 text-[9px] tracking-widest text-neutral-200 hover:text-white"
        >
          <PixelIcon name="save" size={11} />
          СОХРАНИТЬ
        </button>
      </div>
    </form>
  </div>
</main>
