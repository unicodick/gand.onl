<script lang="ts">
  import { playerProfilePath } from "$lib/player-paths";
  import { filterAdminPlayers, type AdminPlayerFilter } from "$lib/players";

  let { data } = $props();
  let query = $state("");
  let filter = $state<AdminPlayerFilter>("all");
  let filteredPlayers = $derived(
    filterAdminPlayers(data.players, query, filter),
  );

  const filters: { id: AdminPlayerFilter; label: string }[] = [
    { id: "all", label: "ВСЕ" },
    { id: "linked", label: "ПРИВЯЗАНЫ" },
    { id: "unlinked", label: "НЕ ПРИВЯЗАНЫ" },
    { id: "blocked", label: "ЗАБЛОКИРОВАНЫ" },
  ];
</script>

<div class="flex items-center justify-between gap-4">
  <div class="space-y-1">
    <h1 class="text-sm text-neutral-100">Игроки</h1>
    <p class="text-[9px] tracking-widest text-neutral-500">
      ВСЕГО: {data.players.length}
    </p>
  </div>
  <a
    href="/account/players/new"
    class="mc-panel mc-tab px-3 py-2 text-[10px] tracking-widest text-neutral-200 hover:text-white"
  >
    + ДОБАВИТЬ
  </a>
</div>

<div class="space-y-3">
  <label class="block text-[9px] tracking-widest text-neutral-500">
    <span class="sr-only">Поиск по нику</span>
    <input
      type="search"
      bind:value={query}
      placeholder="ПОИСК ПО НИКУ"
      autocomplete="off"
      spellcheck="false"
      class="mc-panel w-full bg-transparent px-4 py-3 text-[10px] tracking-normal text-neutral-100 outline-none placeholder:tracking-widest placeholder:text-neutral-600"
    />
  </label>

  <div class="flex flex-wrap gap-1.5">
    {#each filters as item (item.id)}
      <button
        type="button"
        onclick={() => (filter = item.id)}
        class="mc-tab px-3 py-2 text-[8px] tracking-widest"
        class:mc-tab-active={filter === item.id}
      >
        {item.label}
      </button>
    {/each}
  </div>
</div>

<div class="mc-panel panel-in flex flex-col divide-y divide-white/5">
  {#each filteredPlayers as player (player.id)}
    <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div class="min-w-0 flex-1 space-y-1">
        <p class="truncate text-xs text-neutral-100">{player.username}</p>
        <p class="text-[8px] leading-relaxed tracking-widest">
          {#if player.blocked_at}
            <span class="text-red-400">ЗАБЛОКИРОВАН</span>
          {:else if player.owner_discord_id}
            <span class="text-grass">ПРИВЯЗАН</span>
          {:else}
            <span class="text-neutral-500">НЕ ПРИВЯЗАН</span>
          {/if}
          <span class="text-neutral-600"> · /@{player.username}</span>
        </p>
      </div>
      <div class="flex gap-1">
        <a
          href={playerProfilePath(player.username)}
          class="mc-tab px-3 py-2 text-[9px] tracking-widest"
        >
          ПРОФИЛЬ
        </a>
        <a
          href={`/account/players/${player.id}/edit`}
          class="mc-tab px-3 py-2 text-[9px] tracking-widest text-neutral-300 hover:text-white"
        >
          ИЗМЕНИТЬ
        </a>
      </div>
    </div>
  {:else}
    <p class="p-6 text-center text-[10px] tracking-widest text-neutral-500">
      Игроки не найдены
    </p>
  {/each}
</div>
