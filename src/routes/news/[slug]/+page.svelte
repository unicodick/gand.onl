<script lang="ts">
  import { BRAND } from "$lib/creators";
  import NewsArticle from "$lib/components/news/NewsArticle.svelte";
  import { newsCoverUrl } from "$lib/news";

  let { data } = $props();
  let coverUrl = $derived(newsCoverUrl(data.news.cover_key));
</script>

<svelte:head>
  <title>{data.news.title} — {BRAND}</title>
  <meta name="description" content={data.news.title} />
  {#if coverUrl}
    <meta property="og:image" content={coverUrl} />
  {/if}
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <NewsArticle news={data.news} html={data.html} />
</main>
