<script lang="ts">
  import { BRAND } from "$lib/creators";
  import PixelIcon from "$lib/components/PixelIcon.svelte";
  import NewsCover from "$lib/components/news/NewsCover.svelte";
  import NewsTags from "$lib/components/news/NewsTags.svelte";

  let { data } = $props();
  let rail = $state<HTMLDivElement>();
  let activeIndex = $state(0);

  function formatDate(iso: string | null): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function updateActiveIndex(): void {
    const element = rail;
    if (!element) return;
    const cards = Array.from(element.children) as HTMLElement[];
    const closest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.offsetLeft - element.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    activeIndex = closest.index;
  }

  function scrollToCard(index: number): void {
    const element = rail;
    if (!element) return;
    const card = element.children[index] as HTMLElement | undefined;
    if (!card) return;
    element.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }
</script>

<svelte:head>
  <title>Новости — {BRAND}</title>
  <meta name="description" content="новости проекта и zlp.onl" />
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <section class="w-full max-w-5xl space-y-8">
    <header class="space-y-4">
      <p class="text-[10px] tracking-widest text-neutral-500">НОВОСТИ</p>
      <h1 class="text-2xl text-neutral-100 sm:text-3xl">Что нового</h1>
    </header>

    {#if data.items.length > 0}
      <div
        bind:this={rail}
        onscroll={updateActiveIndex}
        class="news-rail panel-in"
        aria-label="Последние новости"
      >
        {#each data.items as item, index (item.id)}
          <a
            href={`/news/${item.slug}`}
            class="news-card mc-panel group snap-start overflow-hidden"
          >
            <div class="aspect-video overflow-hidden bg-neutral-900">
              <div
                class="h-full w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
              >
                <NewsCover
                  coverKey={item.cover_key}
                  alt={item.title}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>

            <div class="flex min-h-40 flex-col gap-3 p-4 sm:p-5">
              <p class="text-[8px] tracking-widest text-neutral-500 uppercase">
                {formatDate(item.published_at)}
              </p>
              <h2
                class="text-xs leading-relaxed text-neutral-100 transition-colors group-hover:text-white sm:text-sm"
              >
                {item.title}
              </h2>
              <div class="mt-auto pt-2">
                <NewsTags tags={item.tags} compact />
              </div>
            </div>
          </a>
        {/each}
      </div>

      {#if data.items.length > 1}
        <div class="flex items-center justify-between md:hidden">
          <div class="flex gap-2" aria-label="Положение в ленте">
            {#each data.items as _, index}
              <button
                type="button"
                onclick={() => scrollToCard(index)}
                class="h-2 w-5 border border-neutral-700 transition-colors"
                class:bg-grass={activeIndex === index}
                class:border-grass={activeIndex === index}
                aria-label={`Показать новость ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
              ></button>
            {/each}
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              onclick={() => scrollToCard(Math.max(0, activeIndex - 1))}
              class="mc-panel mc-tab grid h-9 w-10 place-items-center text-xs"
              aria-label="Предыдущая новость"
            >
              <PixelIcon name="arrow-left" size={12} />
            </button>
            <button
              type="button"
              onclick={() =>
                scrollToCard(Math.min(data.items.length - 1, activeIndex + 1))}
              class="mc-panel mc-tab grid h-9 w-10 place-items-center text-xs"
              aria-label="Следующая новость"
            >
              <PixelIcon name="arrow-right" size={12} />
            </button>
          </div>
        </div>
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

<style>
  .news-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(82%, 1fr);
    gap: 1rem;
    overflow-x: auto;
    padding: 3px 3px 8px;
    scroll-padding-inline: 3px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .news-rail::-webkit-scrollbar {
    display: none;
  }

  .news-card {
    scroll-snap-align: start;
  }

  @media (min-width: 640px) {
    .news-rail {
      grid-auto-columns: minmax(55%, 1fr);
    }
  }

  @media (min-width: 768px) {
    .news-rail {
      grid-auto-flow: row;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      overflow: visible;
    }
  }
</style>
