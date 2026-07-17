<script lang="ts">
  import { untrack } from "svelte";
  import PixelIcon from "$lib/components/PixelIcon.svelte";
  import MarkdownHelp from "$lib/news/components/editor/MarkdownHelp.svelte";
  import NewsCoverField from "$lib/news/components/editor/NewsCoverField.svelte";
  import NewsTagsField from "$lib/news/components/editor/NewsTagsField.svelte";
  import { slugify } from "$lib/slug";

  let {
    title: initialTitle = "",
    slug: initialSlug = "",
    body: initialBody = "",
    coverKey: initialCoverKey = null,
    tags: initialTags = [],
    publishedAt: initialPublishedAt = null,
    published: initialPublished = false,
    submitLabel = "Сохранить",
    errorMessage = null,
    action = undefined,
  }: {
    title?: string;
    slug?: string;
    body?: string;
    coverKey?: string | null;
    tags?: string[];
    publishedAt?: string | null;
    published?: boolean;
    submitLabel?: string;
    errorMessage?: string | null;
    action?: string;
  } = $props();

  let title = $state(untrack(() => initialTitle));
  let slug = $state(untrack(() => initialSlug));
  let body = $state(untrack(() => initialBody));
  let coverKey = $state<string | null>(untrack(() => initialCoverKey));
  let uploadingCover = $state(false);
  let published = $state(untrack(() => initialPublished));
  let slugTouched = $state(untrack(() => Boolean(initialSlug)));

  $effect(() => {
    if (!slugTouched) slug = slugify(title);
  });
</script>

<form
  method="POST"
  {action}
  enctype="multipart/form-data"
  class="flex flex-col gap-5"
>
  <input type="hidden" name="published_at" value={initialPublishedAt ?? ""} />

  {#if errorMessage}
    <p
      class="mc-panel border-l-2 border-l-red-500 p-4 text-[10px] leading-relaxed text-red-300"
    >
      {errorMessage}
    </p>
  {/if}

  <section class="mc-panel panel-in space-y-5 p-5 sm:p-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <label
        class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
      >
        ЗАГОЛОВОК
        <input
          name="title"
          bind:value={title}
          required
          maxlength="140"
          placeholder="Название новости"
          class="border border-white/10 bg-black/20 px-3 py-3 text-xs text-neutral-100 outline-none transition-colors placeholder:text-neutral-700 focus:border-grass-dim"
        />
      </label>

      <label
        class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
      >
        SLUG
        <input
          name="slug"
          bind:value={slug}
          oninput={() => (slugTouched = true)}
          required
          placeholder="news-slug"
          class="border border-white/10 bg-black/20 px-3 py-3 text-xs text-neutral-100 outline-none transition-colors placeholder:text-neutral-700 focus:border-grass-dim"
        />
      </label>
    </div>

    <NewsTagsField {initialTags} />
  </section>

  <NewsCoverField
    {initialCoverKey}
    bind:coverKey
    bind:uploading={uploadingCover}
  />

  <MarkdownHelp />

  <label
    class="flex flex-col gap-2 text-[9px] tracking-widest text-neutral-500"
  >
    ТЕКСТ НОВОСТИ
    <textarea
      name="body"
      bind:value={body}
      required
      rows="22"
      placeholder="Начните писать новость в Markdown…"
      class="mc-panel min-h-96 resize-y bg-transparent px-4 py-4 text-xs leading-loose text-neutral-100 outline-none transition-shadow placeholder:text-neutral-700 focus:shadow-[inset_0_0_0_1px_var(--color-grass-dim),0_0_0_3px_#000]"
    ></textarea>
  </label>

  <section
    class="mc-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <label class="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        name="published"
        bind:checked={published}
        class="peer sr-only"
      />
      <span
        class="relative h-7 w-12 border border-neutral-700 bg-black/30 transition-colors peer-checked:border-grass-dim peer-checked:bg-grass-dim/20 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grass"
      >
        <span
          class="absolute top-1 left-1 h-4 w-4 bg-neutral-600 transition-all"
          class:translate-x-5={published}
          class:bg-grass={published}
        ></span>
      </span>
      <span
        class="text-[9px] tracking-widest"
        class:text-grass={published}
        class:text-neutral-500={!published}
      >
        {published ? "ОПУБЛИКОВАТЬ" : "СОХРАНИТЬ КАК ЧЕРНОВИК"}
      </span>
    </label>

    <div class="flex gap-2">
      <button
        type="submit"
        formaction="/account/news/preview"
        formtarget="_blank"
        disabled={uploadingCover}
        aria-disabled={!coverKey || uploadingCover}
        class="mc-panel mc-tab inline-flex items-center gap-2 px-4 py-3 text-[9px] tracking-widest text-neutral-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        class:opacity-40={!coverKey}
      >
        <PixelIcon name="preview" size={11} />
        ПРЕДПРОСМОТР
      </button>
      <button
        type="submit"
        disabled={uploadingCover}
        aria-disabled={!coverKey || uploadingCover}
        class="mc-panel mc-tab inline-flex items-center gap-2 px-5 py-3 text-[9px] tracking-widest text-neutral-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        class:opacity-40={!coverKey}
      >
        <PixelIcon name="save" size={11} />
        {submitLabel.toUpperCase()}
      </button>
    </div>
  </section>
</form>
