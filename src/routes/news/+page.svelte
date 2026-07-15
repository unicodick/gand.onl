<script lang="ts">
  import { excerpt } from "$lib/markdown";
  import { BRAND } from "$lib/creators";

  let { data } = $props();

  function formatDate(iso: string | null): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
</script>

<svelte:head>
  <title>Новости — {BRAND}</title>
  <meta name="description" content="новости проекта" />
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <section class="w-full max-w-2xl space-y-8">
    <div class="space-y-4">
      <p class="text-[10px] tracking-widest text-neutral-500">НОВОСТИ</p>
      <h1 class="text-2xl text-neutral-100 sm:text-3xl">Что нового</h1>
    </div>

    <div class="flex flex-col gap-4">
      {#each data.items as item (item.id)}
        <a
          href={`/news/${item.slug}`}
          class="mc-panel panel-in block p-5 transition-colors hover:bg-white/5"
        >
          <p class="text-[9px] tracking-widest text-neutral-500">
            {formatDate(item.published_at)}
          </p>
          <h2 class="mt-2 text-sm text-neutral-100">{item.title}</h2>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            {excerpt(item.body)}
          </p>
        </a>
      {:else}
        <p
          class="mc-panel p-6 text-center text-[10px] tracking-widest text-neutral-500"
        >
          Пока нет новостей
        </p>
      {/each}
    </div>

    {#if data.page > 1 || data.hasMore}
      <div class="flex justify-between text-[10px] tracking-widest">
        {#if data.page > 1}
          <a
            href={`/news?page=${data.page - 1}`}
            class="mc-tab px-3 py-2 text-neutral-300 hover:text-white"
          >
            ← НАЗАД
          </a>
        {:else}
          <span></span>
        {/if}
        {#if data.hasMore}
          <a
            href={`/news?page=${data.page + 1}`}
            class="mc-tab px-3 py-2 text-neutral-300 hover:text-white"
          >
            ДАЛЬШЕ →
          </a>
        {/if}
      </div>
    {/if}
  </section>
</main>
