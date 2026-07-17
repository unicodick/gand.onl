<script lang="ts">
  import { BRAND, skinFace } from "$lib/creators";
  import PlayerHead from "$lib/components/PlayerHead.svelte";
  import { filterPlayers, normalizePlayerQuery } from "$lib/players";

  let { data } = $props();
  let query = $state("");
  let filteredPlayers = $derived(filterPlayers(data.players, query));
  let hasQuery = $derived(Boolean(normalizePlayerQuery(query)));

  function handleSearchKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") query = "";
  }
</script>

<svelte:head>
  <title>Игроки — {BRAND}</title>
  <meta name="description" content="игроки zlp.onl" />
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <section class="w-full max-w-5xl space-y-8">
    <div class="space-y-4">
      <p class="text-[10px] tracking-widest text-neutral-500">ИГРОКИ</p>
      <h1 class="text-2xl text-neutral-100 sm:text-3xl">Все игроки zlp.onl</h1>
    </div>

    <div class="space-y-3">
      <label
        for="player-search"
        class="text-[9px] tracking-widest text-neutral-500"
      >
        ПОИСК ПО НИКУ
      </label>
      <div
        class="mc-panel flex items-center gap-3 px-4 py-3 focus-within:shadow-[inset_0_0_0_1px_var(--color-grass-dim),0_0_0_3px_#000]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          class="shrink-0 text-neutral-600"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" />
          <path d="m9.5 9.5 3 3" stroke="currentColor" />
        </svg>
        <input
          id="player-search"
          type="search"
          bind:value={query}
          onkeydown={handleSearchKeydown}
          placeholder="Введите ник игрока"
          autocomplete="off"
          spellcheck="false"
          class="min-w-0 flex-1 bg-transparent text-xs text-neutral-100 outline-none placeholder:text-neutral-700"
        />
        {#if query}
          <button
            type="button"
            onclick={() => (query = "")}
            class="mc-tab px-2 py-1 text-[9px] tracking-widest"
            aria-label="Очистить поиск"
          >
            СБРОСИТЬ
          </button>
        {/if}
      </div>
      <p
        class="text-[8px] tracking-widest text-neutral-600"
        aria-live="polite"
        aria-atomic="true"
      >
        {hasQuery ? "НАЙДЕНО" : "ВСЕГО"}: {filteredPlayers.length}
      </p>
    </div>

    <div
      class="grid grid-cols-[repeat(auto-fill,64px)] justify-center gap-x-4 gap-y-10 py-1 sm:justify-start"
      aria-label="Список игроков"
    >
      {#each filteredPlayers as player (player.id)}
        <PlayerHead
          username={player.username}
          src={skinFace(player.username)}
        />
      {:else}
        <p
          class="mc-panel col-span-full w-full p-6 text-center text-[10px] tracking-widest text-neutral-500"
        >
          {hasQuery ? "Игроки не найдены" : "Пока нет игроков"}
        </p>
      {/each}
    </div>
  </section>
</main>
