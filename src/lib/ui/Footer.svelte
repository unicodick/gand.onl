<script lang="ts">
  import { LINKS } from "$lib/site";
  import type { ServerStatus } from "$lib/minecraft/server-status";

  const SERVER_LINK = LINKS[0];
  let status = $state<ServerStatus | null>(null);

  let statusLabel = $derived.by(() => {
    if (!status) return "Статус сервера загружается";
    if (status.state === "offline") return "Сервер офлайн";
    if (status.state === "unavailable") return "Статус сервера недоступен";
    if (status.players === null) return "Сервер онлайн";
    return `Сервер онлайн, игроков: ${status.players}`;
  });

  $effect(() => {
    const controller = new AbortController();

    fetch("/api/server-status", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ServerStatus | null) => {
        if (data) status = data;
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          status = { state: "unavailable", players: null };
        }
      });

    return () => controller.abort();
  });
</script>

<footer class="flex w-full flex-col items-center gap-2.5 px-4 pt-10 pb-5">
  <div
    class="mc-panel panel-in flex items-center gap-1.5 p-1.5 text-[10px] tracking-widest sm:gap-2 sm:text-xs"
  >
    {#each LINKS as link, i (link.href)}
      {#if i > 0}
        <span class="mc-divider" aria-hidden="true"></span>
      {/if}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        class="mc-tab flex items-center gap-1.5 px-2.5 py-1.5 text-neutral-400"
        aria-label={link.href === SERVER_LINK.href
          ? `${link.label} — ${statusLabel}`
          : undefined}
        title={link.href === SERVER_LINK.href ? statusLabel : undefined}
      >
        {link.label}
        {#if link.href === SERVER_LINK.href}
          <span
            class="size-1.5 shrink-0"
            class:bg-grass={status?.state === "online"}
            class:bg-offline={status?.state === "offline"}
            class:bg-neutral-600={!status || status.state === "unavailable"}
            class:marker-pulse={!status}
            aria-hidden="true"
          ></span>
          {#if status?.state === "online" && status.players !== null}
            <span class="text-neutral-400" aria-hidden="true">
              {status.players}
            </span>
          {/if}
        {/if}
      </a>
    {/each}
  </div>

  <a
    href="/privacy"
    class="mc-tab px-2 py-1 text-[10px] tracking-widest text-neutral-400 sm:text-[10px]"
  >
    КОНФИДЕНЦИАЛЬНОСТЬ
  </a>

  <p
    class="max-w-xs text-center text-[10px] leading-relaxed tracking-wide text-neutral-500 sm:text-[10px]"
  >
    Мы не являемся администрацией или владельцами zlp.onl.<br />
    Not affiliated with Minecraft, Mojang or Microsoft.
  </p>
</footer>
