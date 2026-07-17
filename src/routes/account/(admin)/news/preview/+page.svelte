<script lang="ts">
  import PixelIcon from "$lib/components/PixelIcon.svelte";
  import NewsArticle from "$lib/components/news/NewsArticle.svelte";

  let { form } = $props();
</script>

<svelte:head>
  <title>Предпросмотр новости — gand.onl</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  {#if form?.preview}
    <div class="w-full max-w-3xl">
      <div
        class="mb-6 border border-gold/40 bg-gold/5 px-4 py-3 text-[9px] tracking-widest text-gold"
      >
        ПРЕДПРОСМОТР · ИЗМЕНЕНИЯ НЕ СОХРАНЕНЫ
      </div>
      <NewsArticle
        news={form.preview.news}
        html={form.preview.html}
        backHref="/account/news"
        backLabel="В КАБИНЕТ"
      />
    </div>
  {:else}
    <div class="mc-panel w-full max-w-xl p-6 text-center">
      <p class="text-[10px] leading-relaxed text-neutral-500">
        {form?.errorMessage ?? "Откройте предпросмотр из редактора новости"}
      </p>
      <a
        href="/account/news"
        class="mc-tab mt-5 inline-flex items-center gap-2 px-3 py-2 text-[9px] tracking-widest"
      >
        <PixelIcon name="arrow-left" size={10} />
        В КАБИНЕТ
      </a>
    </div>
  {/if}
</main>
