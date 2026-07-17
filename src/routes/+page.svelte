<script lang="ts">
  import Skin from "$lib/components/Skin.svelte";
  import { CREATORS, BRAND, skinRender } from "$lib/creators";
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
      <Skin name={creator.name} src={skinRender(creator.name)} />
    {/each}
  </div>
</main>
