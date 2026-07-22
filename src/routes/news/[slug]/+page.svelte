<script lang="ts">
  import { BRAND, SITE_ORIGIN } from "$lib/site";
  import NewsArticle from "$lib/news/components/NewsArticle.svelte";
  import { newsCoverUrl } from "$lib/news/model";

  let { data } = $props();
  let coverUrl = $derived.by(() => {
    const path = newsCoverUrl(data.news.cover_key);
    return path ? new URL(path, SITE_ORIGIN).href : null;
  });
</script>

<svelte:head>
  <title>{data.news.title} — {BRAND}</title>
  <meta name="description" content={data.news.title} />
  {#if coverUrl}
    <meta property="og:image" content={coverUrl} />
  {/if}
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <NewsArticle news={data.news} html={data.html} />
</main>
