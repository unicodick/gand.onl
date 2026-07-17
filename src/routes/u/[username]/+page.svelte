<script lang="ts">
  import { BRAND, skinRender } from "$lib/creators";
  import Skin from "$lib/components/Skin.svelte";
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

    <div class="flex min-w-0 flex-col gap-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <h1
            class={`text-xl sm:text-2xl ${data.isAdmin ? "text-gold" : "text-neutral-100"}`}
          >
            {data.player.username}
          </h1>
          {#if data.isLinked}
            <span
              class="text-grass"
              title="Привязан на сайте"
              aria-label="Привязан на сайте"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M5 8.2l2 2 4-4.4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          {/if}
          {#if data.isAdmin}
            <span
              class="text-gold"
              title={`Администратор ${BRAND}`}
              aria-label={`Администратор ${BRAND}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M8 0l1.9 4.6L15 5l-3.6 3.3L12.4 13 8 10.6 3.6 13l1-4.7L1 5l5.1-.4L8 0z"
                />
              </svg>
            </span>
          {/if}
        </div>
        {#if data.showEditLink}
          <a
            href={`/u/${data.player.username}/edit`}
            class="mc-tab px-3 py-2 text-[10px] tracking-widest text-neutral-300 hover:text-white"
          >
            РЕДАКТИРОВАТЬ
          </a>
        {/if}
      </div>

      {#if data.player.bio}
        <div
          class="mc-panel panel-in p-5 text-xs leading-relaxed break-words whitespace-pre-wrap text-neutral-200"
        >
          {data.player.bio}
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
