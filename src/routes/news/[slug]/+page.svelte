<script lang="ts">
  import { BRAND } from "$lib/site";
  import NewsArticle from "$lib/news/components/NewsArticle.svelte";
  import { newsCoverUrl } from "$lib/news/model";

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

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <NewsArticle news={data.news} html={data.html} />
</main>
