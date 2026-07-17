<script lang="ts">
  import { page } from "$app/state";
  import { BRAND } from "$lib/site";

  let status = $derived(page.status);
  let message = $derived(page.error?.message ?? "");
  let notFound = $derived(status === 404);
</script>

<svelte:head>
  <title>{status} — {BRAND}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main
  class="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-12 sm:py-16"
>
  {#if notFound}
    <div class="mc-panel panel-in p-1.5">
      <img
        src="/404.webp"
        alt="404.вебп"
        width="640"
        height="451"
        class="block w-[min(78vw,400px)] select-none"
      />
    </div>
  {/if}

  <div class="flex flex-col items-center gap-3 text-center">
    <p class="text-3xl tracking-widest text-neutral-100 sm:text-5xl">
      {status}
    </p>

    <p
      class="max-w-xs text-[10px] leading-relaxed tracking-wide text-neutral-500 sm:text-xs"
    >
      {#if notFound}
        Такой страницы нет :(
      {:else}
        {message || "Что-то пошло не так."}
      {/if}
    </p>

    <a
      href="/"
      class="mc-panel mt-1 px-4 py-2 text-[10px] tracking-widest text-neutral-200 transition-colors hover:text-white sm:text-xs"
    >
      НА ГЛАВНУЮ
    </a>
  </div>
</main>
