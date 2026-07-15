<script lang="ts">
  import { PROSE_CLASS } from "$lib/markdown";
  import { BRAND } from "$lib/creators";

  let { data } = $props();

  const formattedDate = new Date(data.news.published_at!).toLocaleDateString(
    "ru-RU",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
</script>

<svelte:head>
  <title>{data.news.title} — {BRAND}</title>
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <article class="w-full max-w-2xl space-y-6">
    <a
      href="/news"
      class="text-[10px] tracking-widest text-neutral-500 hover:text-neutral-300"
      >← НОВОСТИ</a
    >

    <div class="space-y-2">
      <p class="text-[9px] tracking-widest text-neutral-500">{formattedDate}</p>
      <h1 class="text-xl text-neutral-100 sm:text-2xl">{data.news.title}</h1>
    </div>

    <div
      class={`mc-panel panel-in p-6 text-xs text-neutral-200 ${PROSE_CLASS}`}
    >
      {@html data.html}
    </div>
  </article>
</main>
