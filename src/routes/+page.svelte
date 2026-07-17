<script lang="ts">
  import Skin from "$lib/components/Skin.svelte";
  import { CREATORS, BRAND, skinRender } from "$lib/creators";
  import { playerProfilePath } from "$lib/player-paths";
</script>

<svelte:head>
  <title>{BRAND}</title>
  <meta name="description" content="Новостное сообщество спавна" />
</svelte:head>

<main
  class="flex w-full flex-1 flex-col items-center justify-center gap-10 px-4 py-12 sm:py-16"
>
  <header class="max-w-4xl space-y-4 text-center">
    <h1 class="text-sm leading-loose text-neutral-100 sm:text-xl">
      <span aria-hidden="true">
        <span class="block">
          Эти люди занимаются х<span
            class="inline-block select-none text-neutral-500 blur-[2px]"
            >##</span
          >нёй.
        </span>
        <span class="block">Поэтому существует {BRAND}.</span>
      </span>
      <span class="sr-only">
        Эти люди занимаются хуйнёй. Поэтому существует {BRAND}.
      </span>
    </h1>

    <p
      class="text-[9px] leading-relaxed tracking-widest text-neutral-500 sm:text-[10px]"
    >
      Новостное сообщество спавна
    </p>
  </header>

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
