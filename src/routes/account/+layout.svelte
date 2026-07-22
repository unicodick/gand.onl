<script lang="ts">
  import { page } from "$app/state";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";

  let { data, children } = $props();

  let TABS = $derived([
    { href: "/account", label: "ПРОФИЛЬ" },
    ...(data.isAdmin
      ? [
          { href: "/account/admin", label: "ОБЗОР" },
          { href: "/account/news", label: "НОВОСТИ" },
          { href: "/account/players", label: "ИГРОКИ" },
        ]
      : []),
  ]);

  let path = $derived(page.url.pathname);
</script>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <div class="flex w-full max-w-3xl flex-col gap-6">
    <div
      class="mc-panel panel-in flex items-center justify-between px-4 py-3 text-[10px] tracking-widest"
    >
      <span class="text-neutral-300">КАБИНЕТ</span>
      <div class="flex items-center gap-3">
        <span class="text-neutral-400">{data.user.username}</span>
        <form method="POST" action="/account/logout">
          <button
            type="submit"
            class="inline-flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <PixelIcon name="logout" size={10} />
            ВЫЙТИ
          </button>
        </form>
      </div>
    </div>

    <div
      class="flex max-w-full gap-1.5 overflow-x-auto pb-1 text-[10px] tracking-widest"
    >
      {#each TABS as tab (tab.href)}
        <a
          href={tab.href}
          class="mc-panel mc-tab shrink-0 px-3 py-2 text-neutral-300 hover:text-white"
          class:mc-tab-active={path === tab.href ||
            (tab.href !== "/account" && path.startsWith(tab.href))}
        >
          {tab.label}
        </a>
      {/each}
    </div>

    {@render children()}
  </div>
</main>
