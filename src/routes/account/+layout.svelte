<script lang="ts">
  import { page } from "$app/state";

  let { data, children } = $props();

  let TABS = $derived([
    { href: "/account", label: "ПРОФИЛЬ" },
    ...(data.isAdmin
      ? [
          { href: "/account/news", label: "НОВОСТИ" },
          { href: "/account/players", label: "ИГРОКИ" },
        ]
      : []),
  ]);

  let path = $derived(page.url.pathname);
</script>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <div class="flex w-full max-w-3xl flex-col gap-6">
    <div
      class="mc-panel panel-in flex items-center justify-between px-4 py-3 text-[10px] tracking-widest"
    >
      <span class="text-neutral-300">КАБИНЕТ</span>
      <div class="flex items-center gap-3">
        <span class="text-neutral-500">{data.user.username}</span>
        <form method="POST" action="/account/logout">
          <button type="submit" class="text-neutral-400 hover:text-white"
            >ВЫЙТИ</button
          >
        </form>
      </div>
    </div>

    <div class="flex gap-1.5 text-[10px] tracking-widest">
      {#each TABS as tab (tab.href)}
        <a
          href={tab.href}
          class="mc-panel mc-tab px-3 py-2 text-neutral-300 hover:text-white"
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
