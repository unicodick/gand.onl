<script lang="ts">
  import { getRosterFreshness } from "$lib/roster/status";

  let { data } = $props();

  const rosterFreshness = $derived(
    getRosterFreshness(data.roster?.last_seen_at),
  );

  const stats = $derived([
    { label: "ИГРОКОВ", value: data.stats.playersTotal },
    { label: "ПРИВЯЗАНО", value: data.stats.playersLinked },
    { label: "НЕ ПРИВЯЗАНО", value: data.stats.playersUnlinked },
    { label: "ЗАБЛОКИРОВАНО", value: data.stats.playersBlocked },
    { label: "НОВОСТЕЙ", value: data.stats.newsPublished },
    { label: "ЧЕРНОВИКОВ", value: data.stats.newsDrafts },
  ]);

  function formatDate(value: string): string {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function actionLabel(action: string): string {
    if (action === "player.blocked") return "заблокировал профиль";
    if (action === "player.unblocked") return "разблокировал профиль";
    if (action === "player.deleted") return "удалил игрока";
    return "изменил профиль";
  }
</script>

<div class="space-y-1">
  <h1 class="text-sm text-neutral-100">Обзор</h1>
  <p class="text-[9px] leading-relaxed tracking-widest text-neutral-500">
    СОСТОЯНИЕ GAND.ONL И ДАННЫХ СООБЩЕСТВА
  </p>
</div>

<section class="mc-panel panel-in overflow-hidden">
  <dl class="grid grid-cols-2 sm:grid-cols-3">
    {#each stats as stat (stat.label)}
      <div class="space-y-2 border-r border-b border-white/5 p-4 sm:p-5">
        <dt class="text-[8px] tracking-widest text-neutral-500">
          {stat.label}
        </dt>
        <dd class="text-lg text-neutral-100">{stat.value}</dd>
      </div>
    {/each}
  </dl>
</section>

<section class="space-y-3">
  <h2 class="text-[10px] tracking-widest text-neutral-300">СОСТОЯНИЕ</h2>
  <div class="mc-panel divide-y divide-white/5">
    <div class="flex items-center justify-between gap-4 p-4">
      <div class="space-y-1">
        <p class="text-[10px] text-neutral-200">zlp.onl</p>
        <p class="text-[8px] tracking-widest text-neutral-600">MCSRVSTAT.US</p>
      </div>
      <div class="flex items-center gap-2 text-[9px] tracking-widest">
        <span
          class="size-1.5"
          class:bg-grass={data.serverStatus.state === "online"}
          class:bg-offline={data.serverStatus.state === "offline"}
          class:bg-neutral-600={data.serverStatus.state === "unavailable"}
          aria-hidden="true"
        ></span>
        {#if data.serverStatus.state === "online"}
          <span class="text-grass">
            ОНЛАЙН{data.serverStatus.players === null
              ? ""
              : ` · ${data.serverStatus.players}`}
          </span>
        {:else if data.serverStatus.state === "offline"}
          <span class="text-red-400">ОФЛАЙН</span>
        {:else}
          <span class="text-neutral-500">НЕДОСТУПЕН</span>
        {/if}
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 p-4">
      <div class="min-w-0 space-y-1">
        <p class="text-[10px] text-neutral-200">Roster API</p>
        {#if data.roster}
          <p class="text-[8px] leading-relaxed text-neutral-600">
            {formatDate(data.roster.last_seen_at)} · ПРИНЯТО {data.roster
              .received_count}
            · НОВЫХ {data.roster.added_count}
          </p>
        {:else}
          <p class="text-[8px] tracking-widest text-neutral-600">
            СИНХРОНИЗАЦИЙ ЕЩЁ НЕ БЫЛО
          </p>
        {/if}
      </div>
      {#if rosterFreshness === "recent"}
        <span class="shrink-0 text-[8px] tracking-widest text-grass">
          ДАННЫЕ СВЕЖИЕ
        </span>
      {:else if rosterFreshness === "stale"}
        <span class="shrink-0 text-[8px] tracking-widest text-neutral-500">
          НЕТ НОВЫХ ДАННЫХ
        </span>
      {:else}
        <span class="shrink-0 text-[8px] tracking-widest text-neutral-600">
          НЕТ ДАННЫХ
        </span>
      {/if}
    </div>
  </div>
</section>

<section class="space-y-3">
  <h2 class="text-[10px] tracking-widest text-neutral-300">
    ПОСЛЕДНИЕ ДЕЙСТВИЯ
  </h2>
  <div class="mc-panel divide-y divide-white/5">
    {#each data.activity as item (item.id)}
      <div class="space-y-1 p-4">
        <p class="text-[9px] leading-relaxed text-neutral-300">
          <span class="text-neutral-100">
            {item.actor_name ?? item.actor_discord_id}
          </span>
          {actionLabel(item.action)}
          {#if item.player_username}
            <span class="text-neutral-100">@{item.player_username}</span>
          {/if}
        </p>
        <p class="text-[8px] text-neutral-600">{formatDate(item.created_at)}</p>
        {#if item.action === "player.blocked" && item.details.reason}
          <p class="text-[8px] leading-relaxed text-neutral-500">
            {String(item.details.reason)}
          </p>
        {/if}
      </div>
    {:else}
      <p class="p-6 text-center text-[9px] tracking-widest text-neutral-500">
        Действий пока нет
      </p>
    {/each}
  </div>
</section>
