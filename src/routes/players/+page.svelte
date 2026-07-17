<script lang="ts">
  import { BRAND, skinFace } from "$lib/creators";
  import PlayerHead from "$lib/components/PlayerHead.svelte";

  let { data } = $props();
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

    <div
      class="grid grid-cols-[repeat(auto-fill,64px)] justify-center gap-x-4 gap-y-10 py-1 sm:justify-start"
      aria-label="Список игроков"
    >
      {#each data.players as player (player.id)}
        <PlayerHead
          username={player.username}
          src={skinFace(player.username)}
        />
      {:else}
        <p
          class="mc-panel col-span-full w-full p-6 text-center text-[10px] tracking-widest text-neutral-500"
        >
          Пока нет игроков
        </p>
      {/each}
    </div>
  </section>
</main>
