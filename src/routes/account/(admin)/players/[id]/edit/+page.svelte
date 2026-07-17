<script lang="ts">
  import { untrack } from "svelte";
  import PixelIcon from "$lib/components/PixelIcon.svelte";
  import { canPreserveDiscordVisibility } from "$lib/discord";
  import { playerProfilePath } from "$lib/player-paths";
  import {
    CUSTOM_LINKS_MAX,
    DISCORD_PLATFORM_ID,
    LINK_SOCIAL_PLATFORMS,
    SOCIAL_PLATFORM_IDS,
  } from "$lib/socials";

  let { data, form } = $props();

  const originalOwnerDiscordId = untrack(
    () => data.player.owner_discord_id ?? "",
  );
  let ownerDiscordId = $state(originalOwnerDiscordId);
  let bio = $state(untrack(() => data.player.bio ?? ""));
  let skinUrl = $state(untrack(() => data.player.skin_url ?? ""));
  let socialValues = $state(
    untrack(() =>
      Object.fromEntries(
        LINK_SOCIAL_PLATFORMS.map((platform) => [
          platform.id,
          data.socials.find((social) => social.platform === platform.id)?.url ??
            "",
        ]),
      ),
    ),
  );
  const existingDiscord = untrack(() =>
    data.socials.find((social) => social.platform === DISCORD_PLATFORM_ID),
  );
  let keepDiscordProfile = $state(Boolean(existingDiscord));
  let canKeepDiscordProfile = $derived(
    canPreserveDiscordVisibility(
      originalOwnerDiscordId || null,
      ownerDiscordId.trim() || null,
    ),
  );
  let blockReason = $state(untrack(() => data.player.block_reason ?? ""));
  let deleteConfirmation = $state("");
  let customLinks = $state(
    untrack(() =>
      data.socials
        .filter((social) => !SOCIAL_PLATFORM_IDS.includes(social.platform))
        .map((social) => ({
          key: crypto.randomUUID(),
          label: social.platform,
          url: social.url,
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

<div class="flex items-start justify-between gap-4">
  <div class="space-y-2">
    <a
      href="/account/players"
      class="inline-flex items-center gap-2 text-[9px] tracking-widest text-neutral-500 hover:text-neutral-200"
    >
      <PixelIcon name="arrow-left" size={10} />
      ИГРОКИ
    </a>
    <h1 class="text-sm leading-relaxed text-neutral-100">
      Игрок — @{data.player.username}
    </h1>
  </div>
  <a
    href={playerProfilePath(data.player.username)}
    class="mc-tab inline-flex items-center gap-2 px-3 py-2 text-[9px] tracking-widest"
  >
    <PixelIcon name="preview" size={10} />
    ПРОФИЛЬ
  </a>
</div>

{#if form?.errorMessage}
  <p
    class="mc-panel border-l-2 border-l-red-500 p-4 text-[9px] leading-relaxed text-red-300"
    role="alert"
  >
    {form.errorMessage}
  </p>
{/if}

<form
  method="POST"
  action="?/save"
  class="mc-panel panel-in space-y-5 p-5 sm:p-6"
>
  <label
    class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
  >
    НИК
    <input
      value={data.player.username}
      disabled
      class="border border-white/5 bg-black/10 px-3 py-3 text-[10px] text-neutral-600"
    />
  </label>

  <label
    class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
  >
    DISCORD ID ВЛАДЕЛЬЦА
    <input
      name="owner_discord_id"
      bind:value={ownerDiscordId}
      placeholder="пусто = не привязан"
      class="border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim"
    />
  </label>

  <label
    class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
  >
    О СЕБЕ
    <textarea
      name="bio"
      bind:value={bio}
      rows="8"
      maxlength="2000"
      class="min-h-40 resize-y border border-white/10 bg-black/20 px-3 py-3 text-[10px] leading-loose tracking-normal text-neutral-100 outline-none focus:border-grass-dim"
    ></textarea>
    <span class="text-right text-[8px] text-neutral-600">{bio.length}/2000</span
    >
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
      class="border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-grass-dim"
    />
  </label>

  <div class="space-y-4 border-t border-white/5 pt-5">
    <p class="text-[9px] tracking-widest text-neutral-500">ССЫЛКИ</p>

    {#if existingDiscord}
      <label
        class="flex cursor-pointer items-start gap-3"
        class:opacity-50={!canKeepDiscordProfile}
      >
        <input
          type="checkbox"
          name="keep_discord_profile"
          bind:checked={keepDiscordProfile}
          disabled={!canKeepDiscordProfile}
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
            СОХРАНИТЬ DISCORD-КАРТОЧКУ
          </span>
          <span class="block text-[8px] leading-relaxed text-neutral-600">
            Администратор может скрыть карточку, но не включить её за владельца.
            Смена владельца автоматически скрывает карточку.
          </span>
        </span>
      </label>
    {:else}
      <p class="text-[8px] leading-relaxed text-neutral-600">
        Discord-карточка не опубликована владельцем.
      </p>
    {/if}

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
          class="mc-tab inline-flex items-center gap-2 px-3 py-2 text-[9px] tracking-widest"
        >
          <PixelIcon name="plus" size={10} />
          ДОБАВИТЬ ССЫЛКУ
        </button>
      {/if}
    </div>
  </div>

  <div class="flex justify-end border-t border-white/5 pt-5">
    <button
      type="submit"
      class="mc-tab inline-flex items-center gap-2 px-4 py-3 text-[9px] tracking-widest text-neutral-200 hover:text-white"
    >
      <PixelIcon name="save" size={11} />
      СОХРАНИТЬ
    </button>
  </div>
</form>

<section class="mc-panel space-y-4 p-5 sm:p-6">
  <div class="space-y-1">
    <h2 class="text-[10px] tracking-widest text-neutral-200">МОДЕРАЦИЯ</h2>
    <p class="text-[8px] leading-relaxed text-neutral-600">
      Причина видна только администраторам. Данные профиля сохраняются.
    </p>
  </div>

  {#if data.player.blocked_at}
    <div class="space-y-2 text-[9px] leading-relaxed">
      <p class="inline-flex items-center gap-2 text-red-400">
        <PixelIcon name="lock" size={10} />
        ПРОФИЛЬ ЗАБЛОКИРОВАН
      </p>
      {#if data.player.block_reason}
        <p class="text-neutral-500">{data.player.block_reason}</p>
      {/if}
    </div>
    <form method="POST" action="?/unblock">
      <button
        type="submit"
        class="mc-tab inline-flex items-center gap-2 px-4 py-3 text-[9px] tracking-widest text-grass hover:text-white"
      >
        <PixelIcon name="unlock" size={11} />
        РАЗБЛОКИРОВАТЬ
      </button>
    </form>
  {:else}
    <form method="POST" action="?/block" class="space-y-3">
      <label
        class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
      >
        ВНУТРЕННЯЯ ПРИЧИНА
        <textarea
          name="block_reason"
          bind:value={blockReason}
          rows="3"
          maxlength="500"
          class="resize-y border border-white/10 bg-black/20 px-3 py-3 text-[10px] leading-relaxed tracking-normal text-neutral-100 outline-none focus:border-red-500/60"
        ></textarea>
      </label>
      <button
        type="submit"
        class="mc-tab inline-flex items-center gap-2 px-4 py-3 text-[9px] tracking-widest text-red-400 hover:text-red-300"
      >
        <PixelIcon name="lock" size={11} />
        ЗАБЛОКИРОВАТЬ
      </button>
    </form>
  {/if}
</section>

<section class="space-y-4 border border-red-500/20 p-5 sm:p-6">
  <div class="space-y-1">
    <h2 class="text-[10px] tracking-widest text-red-400">ОПАСНАЯ ЗОНА</h2>
    <p class="text-[8px] leading-relaxed text-neutral-600">
      Удаляйте только ошибочные записи. Для модерации используйте блокировку.
    </p>
  </div>
  <form method="POST" action="?/delete" class="flex flex-col gap-3 sm:flex-row">
    <input
      name="confirm_username"
      bind:value={deleteConfirmation}
      placeholder={`Введите ${data.player.username}`}
      autocomplete="off"
      class="min-w-0 flex-1 border border-white/10 bg-black/20 px-3 py-3 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700 focus:border-red-500/60"
    />
    <button
      type="submit"
      disabled={deleteConfirmation !== data.player.username}
      class="mc-tab inline-flex items-center justify-center gap-2 px-4 py-3 text-[9px] tracking-widest text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <PixelIcon name="trash" size={11} />
      УДАЛИТЬ
    </button>
  </form>
</section>
