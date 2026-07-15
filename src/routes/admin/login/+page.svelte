<script lang="ts">
  import { page } from "$app/state";
  import { BRAND } from "$lib/creators";

  const errors: Record<string, string> = {
    forbidden: "Этот Discord-аккаунт не в списке админов.",
    state: "Сессия входа истекла, попробуйте ещё раз.",
  };

  let errorMessage = $derived.by(() => {
    const code = page.url.searchParams.get("error");
    return code ? (errors[code] ?? "Не удалось войти.") : null;
  });
</script>

<svelte:head>
  <title>Вход в админку — {BRAND}</title>
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center justify-center px-4"
>
  <div class="mc-panel panel-in flex w-full max-w-sm flex-col gap-6 p-8">
    <div class="space-y-2 text-center">
      <p class="text-[10px] tracking-widest text-neutral-500">АДМИНКА</p>
      <h1 class="text-sm text-neutral-100 sm:text-base">Вход через Discord</h1>
    </div>

    {#if errorMessage}
      <p class="text-center text-[10px] leading-relaxed text-red-400">
        {errorMessage}
      </p>
    {/if}

    <a
      href="/auth/discord/login"
      class="mc-panel mc-tab flex items-center justify-center px-4 py-3 text-center text-[10px] tracking-widest text-neutral-200 hover:text-white"
    >
      ВОЙТИ ЧЕРЕЗ DISCORD
    </a>
  </div>
</main>
