<script lang="ts">
  import { page } from "$app/state";
  import { BRAND } from "$lib/site";

  interface MeResponse {
    user: { discordId: string } | null;
  }

  let path = $derived(page.url.pathname);

  let discordId = $state<string | null>(null);
  let hidden = $state(false);
  let focused = $state(false);
  let scrollAnchor = 0;

  function handleScroll(): void {
    const current = window.scrollY;
    if (current < 64) {
      hidden = false;
      scrollAnchor = current;
      return;
    }

    if (Math.abs(current - scrollAnchor) < 10) return;
    hidden = current > scrollAnchor;
    scrollAnchor = current;
  }

  $effect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? (res.json() as Promise<MeResponse>) : null))
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

<svelte:window onscroll={handleScroll} />

<header
  class="sticky top-0 z-30 flex justify-center px-2 pt-5 pb-3 transition-transform duration-200 motion-reduce:transition-none"
  class:-translate-y-full={hidden && !focused}
  onfocusin={() => (focused = true)}
  onfocusout={() => (focused = false)}
>
  <nav
    class="mc-panel panel-in flex max-w-full items-center gap-1.5 overflow-x-auto p-1.5 text-[10px] tracking-widest sm:gap-2 sm:text-xs"
    aria-label="Основная навигация"
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
