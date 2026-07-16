<script lang="ts">
  import { BRAND, skinFace } from "$lib/creators";

  let { data } = $props();
</script>

<svelte:head>
  <title>Игроки — {BRAND}</title>
  <meta name="description" content="игроки zlp.onl" />
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <section class="w-full max-w-3xl space-y-8">
    <div class="space-y-4">
      <p class="text-[10px] tracking-widest text-neutral-500">ИГРОКИ</p>
      <h1 class="text-2xl text-neutral-100 sm:text-3xl">Все игроки zlp.onl</h1>
    </div>

    <div class="flex flex-wrap gap-3">
      {#each data.players as player (player.id)}
        <a
          href={`/u/${player.username}`}
          class="mc-panel flex w-20 flex-col items-center gap-2 p-3 transition-colors hover:bg-white/5"
        >
          <img
            src={skinFace(player.username)}
            alt={player.username}
            width="64"
            height="64"
            loading="lazy"
            class="pixelated size-12"
          />
          <p class="w-full truncate text-center text-[9px] text-neutral-300">
            {player.username}
          </p>
        </a>
      {:else}
        <p
          class="mc-panel w-full p-6 text-center text-[10px] tracking-widest text-neutral-500"
        >
          Пока нет игроков
        </p>
      {/each}
    </div>
  </section>
</main>
