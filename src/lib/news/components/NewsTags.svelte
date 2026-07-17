<script lang="ts">
  let { tags, compact = false }: { tags: string[]; compact?: boolean } =
    $props();
</script>

{#if tags.length > 0}
  <div class="flex flex-wrap gap-1.5" aria-label="Теги новости">
    {#each tags as tag (tag)}
      <span
        class="border border-grass-dim/70 bg-grass-dim/10 text-grass {compact
          ? 'px-1.5 py-1 text-[8px]'
          : 'px-2 py-1.5 text-[9px]'} tracking-wider uppercase"
      >
        {tag}
      </span>
    {/each}
  </div>
{/if}
