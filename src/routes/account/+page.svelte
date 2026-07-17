<script lang="ts">
  import { BRAND } from "$lib/site";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import { playerEditPath, playerProfilePath } from "$lib/players/paths";

  let { data } = $props();
</script>

<svelte:head>
  <title>Кабинет — {BRAND}</title>
</svelte:head>

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
      {#if !data.player.blocked_at}
        <a
          href={playerEditPath(data.player.username)}
          class="mc-panel mc-tab inline-flex items-center gap-2 px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
        >
          <PixelIcon name="edit" size={11} />
          РЕДАКТИРОВАТЬ
        </a>
      {/if}
    </div>
  {:else}
    <p class="text-xs text-neutral-300">
      Чтобы привязать свой ник Minecraft, напиши <span class="text-neutral-100"
        >setunicode</span
      > в личные сообщения на сервере команду:
    </p>
    <p class="mc-panel bg-black px-3 py-2 text-sm text-neutral-100 select-all">
      /m setunicode {data.linkKey}
    </p>
    <p class="text-[10px] tracking-widest text-neutral-500">
      Код действителен до {new Date(data.linkExpiresAt).toLocaleTimeString(
        "ru-RU",
      )}
    </p>
  {/if}
</div>
