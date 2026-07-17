<script lang="ts">
  import { BRAND, skinRender } from "$lib/creators";
  import DiscordProfileCard from "$lib/components/DiscordProfileCard.svelte";
  import Skin from "$lib/components/Skin.svelte";
  import { playerEditPath, playerProfilePath } from "$lib/player-paths";
  import { SOCIAL_PLATFORMS } from "$lib/socials";

  let { data } = $props();

  const joinedAt = $derived(
    new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(data.player.created_at)),
  );

  function platformLabel(platform: string): string {
    return SOCIAL_PLATFORMS.find((p) => p.id === platform)?.label ?? platform;
  }
</script>

<svelte:head>
  <title>@{data.player.username} — {BRAND}</title>
  <meta
    name="description"
    content={`Профиль игрока @${data.player.username} на ${BRAND}`}
  />
  <link
    rel="canonical"
    href={`https://${BRAND}${playerProfilePath(data.player.username)}`}
  />
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-10 sm:py-16">
  <article
    class="mc-panel panel-in grid w-full max-w-5xl lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)]"
  >
    <div
      class="flex min-h-80 items-end justify-center overflow-hidden border-b border-black/70 bg-[radial-gradient(circle_at_50%_35%,rgba(108,174,58,0.12),transparent_55%)] px-6 pt-8 lg:min-h-[32rem] lg:border-r lg:border-b-0"
    >
      <Skin
        name={data.player.username}
        src={data.player.skin_url ?? skinRender(data.player.username)}
        compact
      />
    </div>

    <div class="flex min-w-0 flex-col p-5 sm:p-7 lg:p-9">
      <header class="border-b border-white/8 pb-6">
        <div class="mb-4 flex items-center justify-between gap-4">
          <p class="text-[8px] tracking-[0.24em] text-neutral-600">
            ПРОФИЛЬ ИГРОКА
          </p>
          {#if data.showEditLink}
            <a
              href={playerEditPath(data.player.username)}
              class="mc-tab -mr-2 px-3 py-2 text-[8px] tracking-widest text-neutral-400 hover:text-white"
            >
              РЕДАКТИРОВАТЬ
            </a>
          {/if}
        </div>

        <h1
          class={`break-all text-xl leading-relaxed sm:text-2xl ${data.isAdmin ? "text-gold" : "text-neutral-100"}`}
        >
          <span class="text-neutral-600">@</span>{data.player.username}
        </h1>

        <div class="mt-4 flex flex-wrap gap-2">
          {#if data.isLinked}
            <span
              class="border border-grass-dim/60 bg-grass-dim/10 px-2 py-1.5 text-[7px] tracking-widest text-grass"
            >
              ✓ ПРОФИЛЬ ПРИВЯЗАН
            </span>
          {:else}
            <span
              class="border border-neutral-700/80 px-2 py-1.5 text-[7px] tracking-widest text-neutral-600"
            >
              НЕ ПРИВЯЗАН
            </span>
          {/if}
          {#if data.isAdmin}
            <span
              class="border border-gold/40 bg-gold/5 px-2 py-1.5 text-[7px] tracking-widest text-gold"
            >
              ★ АДМИН {BRAND.toUpperCase()}
            </span>
          {/if}
        </div>
      </header>

      <section class="flex-1 border-b border-white/8 py-6">
        <p class="mb-3 text-[8px] tracking-[0.2em] text-neutral-600">О СЕБЕ</p>
        {#if data.player.bio}
          <p
            class="text-[10px] leading-loose break-words whitespace-pre-wrap text-neutral-300 sm:text-xs"
          >
            {data.player.bio}
          </p>
        {:else}
          <p class="text-[9px] leading-loose text-neutral-600">
            Игрок пока ничего о себе не рассказал.
          </p>
        {/if}
      </section>

      {#if data.discordProfile || data.socials.length}
        <section class="space-y-3 border-b border-white/8 py-6">
          <p class="text-[8px] tracking-[0.2em] text-neutral-600">ССЫЛКИ</p>

          {#if data.discordProfile}
            <DiscordProfileCard profile={data.discordProfile} />
          {/if}

          {#if data.socials.length}
            <div class="grid gap-2 sm:grid-cols-2">
              {#each data.socials as social (social.id)}
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mc-tab flex min-w-0 items-center justify-between gap-3 border border-white/8 bg-white/2 px-3 py-3 text-[8px] tracking-widest text-neutral-400 hover:text-white"
                >
                  <span class="truncate">{platformLabel(social.platform)}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              {/each}
            </div>
          {/if}
        </section>
      {/if}

      <footer class="pt-6">
        <p
          class="text-[7px] leading-relaxed tracking-[0.18em] text-neutral-600"
        >
          В КАТАЛОГЕ С {joinedAt.toUpperCase()}
        </p>
      </footer>
    </div>
  </article>
</main>
