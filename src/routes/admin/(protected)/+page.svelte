<script lang="ts">
  let { data } = $props();
</script>

<div class="flex items-center justify-between">
  <h1 class="text-sm text-neutral-100">Новости</h1>
  <a
    href="/admin/news/new"
    class="mc-panel mc-tab px-3 py-2 text-[10px] tracking-widest text-neutral-200 hover:text-white"
  >
    + НОВАЯ
  </a>
</div>

<div class="mc-panel panel-in flex flex-col divide-y divide-white/5">
  {#each data.news as item (item.id)}
    <div class="flex items-center justify-between gap-4 p-4">
      <div class="min-w-0 flex-1 space-y-1">
        <p class="truncate text-xs text-neutral-100">{item.title}</p>
        <p class="text-[9px] tracking-widest text-neutral-500">
          {item.published ? "ОПУБЛИКОВАНО" : "ЧЕРНОВИК"} · /news/{item.slug}
        </p>
      </div>
      <a
        href={`/admin/news/${item.id}/edit`}
        class="mc-tab px-3 py-2 text-[10px] tracking-widest text-neutral-300 hover:text-white"
      >
        РЕДАКТИРОВАТЬ
      </a>
    </div>
  {:else}
    <p class="p-6 text-center text-[10px] tracking-widest text-neutral-500">
      Пока нет новостей
    </p>
  {/each}
</div>
