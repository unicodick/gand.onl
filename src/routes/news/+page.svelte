<script lang="ts">
  import { BRAND } from "$lib/site";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import NewsCover from "$lib/news/components/NewsCover.svelte";
  import NewsTags from "$lib/news/components/NewsTags.svelte";

  let { data } = $props();
  let featured = $derived(data.items[0]);
  let remaining = $derived(data.items.slice(1));

  function formatDate(iso: string | null): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function pageHref(page: number): string {
    return page === 1 ? "/news" : `/news?page=${page}`;
  }
</script>

<svelte:head>
  <title>Новости — {BRAND}</title>
  <meta name="description" content="Новости проекта и zlp.onl" />
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <section class="w-full max-w-6xl space-y-8">
    <header class="space-y-4">
      <p class="text-[10px] tracking-widest text-neutral-500">НОВОСТИ</p>
      <h1 class="text-2xl text-neutral-100 sm:text-3xl">Что нового</h1>
    </header>

    {#if featured}
      <div class="space-y-6">
        <a
          href={`/news/${featured.slug}`}
          class="mc-panel panel-in group grid overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-grass-dim lg:min-h-96 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)]"
        >
          <div
            class="aspect-video overflow-hidden bg-neutral-900 lg:aspect-auto"
          >
            <div
              class="h-full min-h-full w-full transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none"
            >
              <NewsCover
                coverKey={featured.cover_key}
                alt={featured.title}
                loading="eager"
              />
            </div>
          </div>

          <div class="flex min-h-56 flex-col gap-5 p-5 sm:min-h-64 sm:p-7">
            <p class="text-[9px] tracking-widest text-neutral-500 uppercase">
              {formatDate(featured.published_at)}
            </p>
            <h2
              class="text-base leading-relaxed text-neutral-100 transition-colors group-hover:text-white sm:text-xl lg:text-lg"
            >
              {featured.title}
            </h2>
            <div class="mt-auto space-y-5 pt-2">
              <NewsTags tags={featured.tags} />
              <span
                class="inline-flex items-center gap-2 text-[9px] tracking-widest text-neutral-500 transition-colors group-hover:text-neutral-200"
              >
                ЧИТАТЬ
                <PixelIcon name="arrow-right" size={11} />
              </span>
            </div>
          </div>
        </a>

        {#if remaining.length > 0}
          <div class="grid gap-6 sm:grid-cols-2">
            {#each remaining as item (item.id)}
              <a
                href={`/news/${item.slug}`}
                class="mc-panel group flex flex-col overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-grass-dim"
              >
                <div class="aspect-video overflow-hidden bg-neutral-900">
                  <div
                    class="h-full w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                  >
                    <NewsCover
                      coverKey={item.cover_key}
                      alt={item.title}
                      loading="lazy"
                    />
                  </div>
                </div>

                <div class="flex min-h-44 flex-1 flex-col gap-3 p-5 sm:p-6">
                  <p
                    class="text-[8px] tracking-widest text-neutral-500 uppercase"
                  >
                    {formatDate(item.published_at)}
                  </p>
                  <h2
                    class="text-sm leading-relaxed text-neutral-100 transition-colors group-hover:text-white sm:text-base"
                  >
                    {item.title}
                  </h2>
                  <div class="mt-auto pt-3">
                    <NewsTags tags={item.tags} compact />
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {/if}
      </div>

      {#if data.pageCount > 1}
        <nav
          class="flex items-center justify-between gap-3 pt-2"
          aria-label="Страницы новостей"
        >
          {#if data.page > 1}
            <a
              href={pageHref(data.page - 1)}
              class="mc-panel mc-tab inline-flex h-11 items-center gap-2 px-3 text-[9px] tracking-widest sm:px-4"
              rel="prev"
              aria-label="Предыдущая страница новостей"
            >
              <PixelIcon name="arrow-left" size={11} />
              <span class="hidden sm:inline">НОВЕЕ</span>
            </a>
          {:else}
            <span class="h-11 w-11 sm:w-24" aria-hidden="true"></span>
          {/if}

          <p
            class="text-center text-[9px] tracking-widest text-neutral-500"
            aria-live="polite"
          >
            {data.page} / {data.pageCount}
          </p>

          {#if data.page < data.pageCount}
            <a
              href={pageHref(data.page + 1)}
              class="mc-panel mc-tab inline-flex h-11 items-center gap-2 px-3 text-[9px] tracking-widest sm:px-4"
              rel="next"
              aria-label="Следующая страница новостей"
            >
              <span class="hidden sm:inline">СТАРЕЕ</span>
              <PixelIcon name="arrow-right" size={11} />
            </a>
          {:else}
            <span class="h-11 w-11 sm:w-24" aria-hidden="true"></span>
          {/if}
        </nav>
      {/if}
    {:else}
      <p
        class="mc-panel p-6 text-center text-[10px] tracking-widest text-neutral-500"
      >
        Пока нет новостей
      </p>
    {/if}
  </section>
</main>
