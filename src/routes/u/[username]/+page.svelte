<script lang="ts">
  import { BRAND, skinRender } from "$lib/creators";
  import Skin from "$lib/components/Skin.svelte";
  import { PROSE_CLASS } from "$lib/markdown";
  import { SOCIAL_PLATFORMS } from "$lib/socials";

  let { data } = $props();

  function platformLabel(platform: string): string {
    return SOCIAL_PLATFORMS.find((p) => p.id === platform)?.label ?? platform;
  }
</script>

<svelte:head>
  <title>{data.player.username} — {BRAND}</title>
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <section class="grid w-full max-w-3xl gap-8 md:grid-cols-[auto_1fr]">
    <div class="flex justify-center md:justify-start">
      <Skin
        name={data.player.username}
        src={data.player.skin_url ?? skinRender(data.player.username)}
      />
    </div>

    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-xl text-neutral-100 sm:text-2xl">
          {data.player.username}
        </h1>
        {#if data.showEditLink}
          <a
            href={`/u/${data.player.username}/edit`}
            class="mc-tab px-3 py-2 text-[10px] tracking-widest text-neutral-300 hover:text-white"
          >
            РЕДАКТИРОВАТЬ
          </a>
        {/if}
      </div>

      {#if data.bioHtml}
        <div
          class={`mc-panel panel-in p-5 text-xs text-neutral-200 ${PROSE_CLASS}`}
        >
          {@html data.bioHtml}
        </div>
      {/if}

      {#if data.socials.length}
        <div class="flex flex-wrap gap-2">
          {#each data.socials as social (social.id)}
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              class="mc-panel px-4 py-3 text-[10px] tracking-widest text-neutral-300 transition-colors hover:text-white sm:text-xs"
            >
              {platformLabel(social.platform)}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</main>
