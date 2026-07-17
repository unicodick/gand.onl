<script lang="ts">
  import Skin from "$lib/components/Skin.svelte";
  import { CREATORS, BRAND, skinRender } from "$lib/creators";
  import { playerProfilePath } from "$lib/player-paths";
</script>

<svelte:head>
  <title>{BRAND}</title>
  <meta name="description" content="мы дети спавна" />
</svelte:head>

<main
  class="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-12 sm:py-16"
>
  <div class="flex items-end justify-center gap-6 sm:gap-16">
    {#each CREATORS as creator (creator.name)}
      <a
        href={playerProfilePath(creator.name)}
        class="block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-grass-dim"
        aria-label={`Профиль игрока ${creator.name}`}
        title={creator.name}
      >
        <Skin name={creator.name} src={skinRender(creator.name)} />
      </a>
    {/each}
  </div>
</main>
