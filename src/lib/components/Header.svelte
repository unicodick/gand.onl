<script lang="ts">
  import { page } from "$app/state";
  import { BRAND } from "$lib/creators";

  let path = $derived(page.url.pathname);

  const NAV = [
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
  </nav>
</header>
