<script lang="ts">
  import { PROSE_CLASS } from "$lib/news/markdown";
  import type { PublicNewsRow } from "$lib/server/news/repository";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import NewsCover from "./NewsCover.svelte";
  import NewsTags from "./NewsTags.svelte";

  let {
    news,
    html,
    backHref = "/news",
    backLabel = "НАЗАД К НОВОСТЯМ",
  }: {
    news: PublicNewsRow;
    html: string;
    backHref?: string;
    backLabel?: string;
  } = $props();

  let formattedDate = $derived(
    new Date(news.published_at ?? news.updated_at).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );
</script>

<article class="w-full max-w-3xl space-y-6">
  <a
    href={backHref}
    class="inline-flex items-center gap-2 text-[9px] tracking-widest text-neutral-500 transition-colors hover:text-neutral-200"
  >
    <PixelIcon name="arrow-left" size={11} />
    {backLabel}
  </a>

  <header class="space-y-4">
    <p class="text-[9px] tracking-widest text-neutral-500 uppercase">
      {formattedDate}
    </p>
    <h1
      class="max-w-2xl text-xl leading-relaxed text-neutral-100 sm:text-2xl md:text-3xl"
    >
      {news.title}
    </h1>
    <NewsTags tags={news.tags} />
  </header>

  <div class="mc-panel aspect-video overflow-hidden">
    <NewsCover coverKey={news.cover_key} alt={news.title} loading="eager" />
  </div>

  <div
    class={`mc-panel panel-in p-5 text-xs leading-loose text-neutral-200 sm:p-7 ${PROSE_CLASS}`}
  >
    {@html html}
  </div>
</article>
