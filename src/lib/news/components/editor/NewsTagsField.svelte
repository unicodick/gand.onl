<script lang="ts">
  import { untrack } from "svelte";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import {
    MAX_NEWS_TAG_LENGTH,
    MAX_NEWS_TAGS,
    normalizeNewsTags,
  } from "$lib/news/model";

  let { initialTags = [] }: { initialTags?: string[] } = $props();

  let tags = $state(untrack(() => [...initialTags]));
  let tagInput = $state("");
  let serializedTags = $derived(JSON.stringify(tags));

  function addTag(): void {
    const next = normalizeNewsTags([...tags, tagInput]);
    if (next.length === tags.length) return;
    tags = next;
    tagInput = "";
  }

  function removeTag(index: number): void {
    tags = tags.filter((_, tagIndex) => tagIndex !== index);
  }

  function handleTagKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  }
</script>

<input type="hidden" name="tags" value={serializedTags} />

<div class="space-y-2">
  <div class="flex items-center justify-between gap-4">
    <label for="news-tag" class="text-[10px] tracking-widest text-neutral-400">
      ТЕГИ
    </label>
    <span class="text-[10px] tracking-wider text-neutral-400">
      {tags.length}/{MAX_NEWS_TAGS}
    </span>
  </div>

  <div class="flex flex-wrap gap-2">
    {#each tags as tag, index (`${tag}-${index}`)}
      <span
        class="flex items-center gap-2 border border-grass-dim/70 bg-grass-dim/10 px-2 py-1.5 text-[10px] text-grass"
      >
        {tag}
        <button
          type="button"
          onclick={() => removeTag(index)}
          class="text-neutral-400 transition-colors hover:text-white"
          aria-label={`Удалить тег ${tag}`}
        >
          <PixelIcon name="close" size={8} />
        </button>
      </span>
    {/each}

    {#if tags.length < MAX_NEWS_TAGS}
      <div
        class="flex min-w-52 flex-1 border border-white/10 bg-black/20 focus-within:border-grass-dim"
      >
        <input
          id="news-tag"
          bind:value={tagInput}
          onkeydown={handleTagKeydown}
          maxlength={MAX_NEWS_TAG_LENGTH}
          placeholder="Введите тег и нажмите Enter"
          class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-400"
        />
        <button
          type="button"
          onclick={addTag}
          class="mc-tab grid min-w-9 place-items-center border-l border-white/10 px-3"
          aria-label="Добавить тег"
        >
          <PixelIcon name="plus" size={9} />
        </button>
      </div>
    {/if}
  </div>
</div>
