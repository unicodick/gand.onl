<script lang="ts">
  import { untrack } from "svelte";
  import { BRAND } from "$lib/site";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
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
  <title>Кабинет — {BRAND}</title>
</svelte:head>

<div class="space-y-6">
  <div class="mc-panel panel-in flex flex-col gap-4 p-6">
    {#if data.player}
      {#if data.player.blocked_at}
        <p class="text-xs leading-relaxed text-neutral-300">
          Профиль <span class="text-neutral-100">@{data.player.username}</span>
          временно недоступен. Редактирование отключено.
        </p>
      {:else}
        <p class="text-xs text-neutral-300">
          Твой профиль привязан к нику <span class="text-neutral-100"
            >{data.player.username}</span
          >.
        </p>
      {/if}
      <div class="flex gap-2">
        <a
          href={playerProfilePath(data.player.username)}
          class="mc-panel mc-tab inline-flex items-center gap-2 px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
        >
          <PixelIcon name="preview" size={11} />
          ПРОФИЛЬ
        </a>
      </div>
    {:else}
      <p class="text-xs text-neutral-300">
        Чтобы привязать свой ник Minecraft, напиши <span
          class="text-neutral-100">setunicode</span
        > в личные сообщения на сервере команду:
      </p>
      <p
        class="mc-panel bg-black px-3 py-2 text-sm text-neutral-100 select-all"
      >
        /m setunicode {data.linkKey}
      </p>
      <p class="text-[10px] tracking-widest text-neutral-500">
        Код действителен до {new Date(data.linkExpiresAt).toLocaleTimeString(
          "ru-RU",
        )}
      </p>
    {/if}
  </div>

  {#if data.player && !data.player.blocked_at}
    <form
      method="POST"
      class="mc-panel panel-in flex flex-col gap-5 p-5 sm:p-6"
    >
      <div class="space-y-2">
        <p class="text-[9px] tracking-widest text-neutral-500">
          РЕДАКТИРОВАНИЕ
        </p>
        <h1 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
          Профиль @{data.player.username}
        </h1>
      </div>

      {#if data.saved}
        <p
          class="border-l-2 border-l-grass bg-grass/5 p-3 text-[9px] leading-relaxed text-green-300"
          role="status"
        >
          Профиль сохранён
        </p>
      {/if}

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

      <div class="flex justify-end border-t border-white/5 pt-5">
        <button
          type="submit"
          class="mc-tab inline-flex items-center justify-center gap-2 px-4 py-3 text-[9px] tracking-widest text-neutral-200 hover:text-white"
        >
          <PixelIcon name="save" size={11} />
          СОХРАНИТЬ
        </button>
      </div>
    </form>
  {/if}
</div>
