<script lang="ts">
  import { newsCoverUrl } from "$lib/news";

  let {
    coverKey,
    alt,
    loading = "lazy",
  }: {
    coverKey: string | null;
    alt: string;
    loading?: "eager" | "lazy";
  } = $props();

  let url = $derived(newsCoverUrl(coverKey));
</script>

{#if url}
  <img
    src={url}
    {alt}
    {loading}
    class="h-full w-full object-cover"
    width="1200"
    height="675"
  />
{:else}
  <div
    class="news-cover-placeholder flex h-full w-full items-center justify-center overflow-hidden bg-neutral-900"
    role="img"
    aria-label={`Обложка: ${alt}`}
  >
    <span class="relative text-[9px] tracking-[0.3em] text-neutral-500">
      GAND.ONL NEWS
    </span>
  </div>
{/if}

<style>
  .news-cover-placeholder {
    background-image:
      linear-gradient(
        135deg,
        transparent 45%,
        rgb(77 124 42 / 0.2) 45% 55%,
        transparent 55%
      ),
      linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px);
    background-size:
      100% 100%,
      16px 16px,
      16px 16px;
  }
</style>
