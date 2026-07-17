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

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <section class="grid w-full max-w-3xl gap-8 md:grid-cols-[auto_1fr]">
    <div class="flex justify-center md:justify-start">
      <Skin
        name={data.player.username}
        src={data.player.skin_url ?? skinRender(data.player.username)}
      />
    </div>

    <div class="flex min-w-0 flex-col justify-center gap-6">
      <header class="space-y-3">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 space-y-2">
            <p class="text-[9px] tracking-widest text-neutral-500">
              ПРОФИЛЬ ИГРОКА
            </p>
            <h1
              class={`break-all text-xl leading-relaxed sm:text-2xl ${data.isAdmin ? "text-gold" : "text-neutral-100"}`}
            >
              <span class="text-neutral-600">@</span>{data.player.username}
            </h1>
          </div>

          {#if data.showEditLink}
            <a
              href={playerEditPath(data.player.username)}
              class="mc-tab shrink-0 px-3 py-2 text-[9px] tracking-widest"
            >
              ИЗМЕНИТЬ
            </a>
          {/if}
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-2 text-[8px] tracking-widest">
          <span class={data.isLinked ? "text-grass" : "text-neutral-600"}>
            {data.isLinked ? "✓ ПРИВЯЗАН" : "НЕ ПРИВЯЗАН"}
          </span>
          {#if data.isAdmin}
            <span class="text-gold">★ АДМИН {BRAND.toUpperCase()}</span>
          {/if}
        </div>
      </header>

      <div
        class="mc-panel panel-in p-5 text-[10px] leading-loose break-words whitespace-pre-wrap text-neutral-300 sm:text-xs"
      >
        {data.player.bio || "Игрок пока ничего о себе не рассказал."}
      </div>

      {#if data.discordProfile || data.socials.length}
        <div class="space-y-3">
          <p class="text-[9px] tracking-widest text-neutral-500">ССЫЛКИ</p>

          {#if data.discordProfile}
            <DiscordProfileCard profile={data.discordProfile} />
          {/if}

          {#if data.socials.length}
            <div class="flex flex-wrap gap-2">
              {#each data.socials as social (social.id)}
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mc-panel px-4 py-3 text-[9px] tracking-widest text-neutral-300 transition-colors hover:text-white"
                >
                  {platformLabel(social.platform)}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <p class="text-[8px] leading-relaxed tracking-widest text-neutral-600">
        В КАТАЛОГЕ С {joinedAt.toUpperCase()}
      </p>
    </div>
  </section>
</main>
