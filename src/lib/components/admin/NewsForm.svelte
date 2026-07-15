<script lang="ts">
  import { untrack } from "svelte";
  import { PROSE_CLASS, renderMarkdown } from "$lib/markdown";
  import { slugify } from "$lib/slug";

  let {
    title: initialTitle = "",
    slug: initialSlug = "",
    body: initialBody = "",
    published: initialPublished = false,
    submitLabel = "Сохранить",
    errorMessage = null,
    action = undefined,
  }: {
    title?: string;
    slug?: string;
    body?: string;
    published?: boolean;
    submitLabel?: string;
    errorMessage?: string | null;
    action?: string;
  } = $props();

  let title = $state(untrack(() => initialTitle));
  let slug = $state(untrack(() => initialSlug));
  let body = $state(untrack(() => initialBody));
  let slugTouched = $state(untrack(() => Boolean(initialSlug)));

  $effect(() => {
    if (!slugTouched) slug = slugify(title);
  });

  let previewHtml = $derived(body ? renderMarkdown(body) : "");
</script>

<form method="POST" {action} class="mc-panel panel-in flex flex-col gap-4 p-6">
  {#if errorMessage}
    <p class="text-[10px] text-red-400">{errorMessage}</p>
  {/if}

  <label
    class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
  >
    ЗАГОЛОВОК
    <input
      name="title"
      bind:value={title}
      required
      class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
    />
  </label>

  <label
    class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
  >
    SLUG
    <input
      name="slug"
      bind:value={slug}
      oninput={() => (slugTouched = true)}
      required
      class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
    />
  </label>

  <div class="grid gap-4 md:grid-cols-2">
    <label
      class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
    >
      ТЕКСТ (MARKDOWN)
      <textarea
        name="body"
        bind:value={body}
        required
        rows="16"
        class="mc-panel bg-transparent px-3 py-2 text-xs leading-relaxed text-neutral-100 outline-none"
      ></textarea>
    </label>

    <div
      class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
    >
      ПРЕВЬЮ
      <div
        class={`mc-panel min-h-40 flex-1 overflow-auto px-3 py-2 text-xs text-neutral-200 ${PROSE_CLASS}`}
      >
        {@html previewHtml}
      </div>
    </div>
  </div>

  <label
    class="flex items-center gap-2 text-[10px] tracking-widest text-neutral-500"
  >
    <input type="checkbox" name="published" checked={initialPublished} />
    ОПУБЛИКОВАТЬ
  </label>

  <button
    type="submit"
    class="mc-panel mc-tab px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
  >
    {submitLabel}
  </button>
</form>
