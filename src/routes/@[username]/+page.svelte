<script lang="ts">
  import { skinRender } from "$lib/minecraft/skins";
  import { BRAND } from "$lib/site";
  import DiscordProfileCard from "$lib/discord/components/DiscordProfileCard.svelte";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import ProfileBadge from "$lib/players/components/ProfileBadge.svelte";
  import Skin from "$lib/players/components/Skin.svelte";
  import { playerEditPath, playerProfilePath } from "$lib/players/paths";
  import { SOCIAL_PLATFORMS } from "$lib/players/socials";

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
  {#if data.player.blocked_at}
    <section class="w-full max-w-xl space-y-6">
      <div class="space-y-3">
        <p class="text-[9px] tracking-widest text-neutral-500">
          ПРОФИЛЬ ИГРОКА
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <h1
            class="break-all text-xl leading-relaxed text-neutral-100 sm:text-2xl"
          >
            <span class="text-neutral-600">@</span>{data.player.username}
          </h1>
          <ProfileBadge
            icon="lock"
            label="Профиль заблокирован"
            class="text-red-400"
          />
        </div>
      </div>

      <div class="mc-panel panel-in space-y-3 p-6">
        <p class="text-xs text-neutral-200">Профиль недоступен</p>
        <p class="text-[9px] leading-relaxed text-neutral-500">
          Публичная информация этого профиля временно скрыта.
        </p>
      </div>

      <a
        href="/players"
        class="mc-tab inline-flex items-center gap-2 px-3 py-2 text-[9px] tracking-widest"
      >
        <PixelIcon name="arrow-left" size={11} />
        ВСЕ ИГРОКИ
      </a>
    </section>
  {:else}
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
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1
                  class={`break-all text-xl leading-relaxed sm:text-2xl ${data.isAdmin ? "text-gold" : "text-neutral-100"}`}
                >
                  <span class="text-neutral-600">@</span>{data.player.username}
                </h1>
                <div class="flex items-center gap-1">
                  <ProfileBadge
                    icon={data.isLinked ? "link" : "unlink"}
                    label={data.isLinked
                      ? "Привязанный профиль"
                      : "Профиль не привязан"}
                    class={data.isLinked ? "text-grass" : "text-neutral-600"}
                  />
                  {#if data.isAdmin}
                    <ProfileBadge
                      icon="admin"
                      label={`Администратор ${BRAND}`}
                      class="text-gold"
                    />
                  {/if}
                </div>
              </div>
            </div>

            {#if data.showEditLink}
              <a
                href={playerEditPath(data.player.username)}
                class="mc-tab inline-flex shrink-0 items-center gap-2 px-3 py-2 text-[9px] tracking-widest"
              >
                <PixelIcon name="edit" size={11} />
                ИЗМЕНИТЬ
              </a>
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
                    class="mc-panel inline-flex items-center gap-2 px-4 py-3 text-[9px] tracking-widest text-neutral-300 transition-colors hover:text-white"
                  >
                    {platformLabel(social.platform)}
                    <PixelIcon name="external-link" size={10} />
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
  {/if}
</main>
