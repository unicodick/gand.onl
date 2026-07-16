<script lang="ts">
  import { page } from "$app/state";
  import { BRAND } from "$lib/creators";

  let path = $derived(page.url.pathname);

  let discordId = $state<string | null>(null);

  $effect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        discordId = data?.user?.discordId ?? null;
      })
      .catch(() => {});
  });

  const NAV = [
    { href: "/players", label: "ИГРОКИ" },
    { href: "/news", label: "НОВОСТИ" },
    { href: "/contact", label: "СВЯЗЬ" },
  ];
</script>

<header class="fixed top-5 left-1/2 z-30 -translate-x-1/2">
  <nav
    class="mc-panel panel-in flex items-center gap-1.5 p-1.5 text-[10px] tracking-widest sm:gap-2 sm:text-xs"
  >
    <a
      href="/"
      class="mc-tab px-2.5 py-1.5 text-neutral-100 transition-colors hover:text-white"
      >{BRAND}</a
    >

    <span class="mc-divider" aria-hidden="true"></span>

    {#each NAV as item (item.href)}
      <a
        href={item.href}
        class="mc-tab px-2.5 py-1.5"
        class:mc-tab-active={path === item.href}
        aria-current={path === item.href ? "page" : undefined}>{item.label}</a
      >
    {/each}

    <span class="mc-divider" aria-hidden="true"></span>

    {#if discordId}
      <a
        href="/account"
        class="mc-tab px-2.5 py-1.5"
        class:mc-tab-active={path === "/account"}
        aria-current={path === "/account" ? "page" : undefined}>КАБИНЕТ</a
      >
    {:else}
      <a
        href="/auth/discord/login?redirect_to=/account"
        class="mc-tab px-2.5 py-1.5">ВОЙТИ</a
      >
    {/if}
  </nav>
</header>
