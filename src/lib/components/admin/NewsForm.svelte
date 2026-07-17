<script lang="ts">
  import { untrack } from "svelte";
  import PixelIcon from "$lib/components/PixelIcon.svelte";
  import {
    MAX_NEWS_TAG_LENGTH,
    MAX_NEWS_TAGS,
    newsCoverUrl,
    normalizeNewsTags,
    validateNewsCover,
  } from "$lib/news";
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
  let tags = $state(untrack(() => [...initialTags]));
  let tagInput = $state("");
  let coverKey = $state<string | null>(untrack(() => initialCoverKey));
  let coverPreviewUrl = $state<string | null>(
    untrack(() => newsCoverUrl(initialCoverKey)),
  );
  let coverInput = $state<HTMLInputElement>();
  let coverError = $state<string | null>(null);
  let uploadingCover = $state(false);
  let published = $state(untrack(() => initialPublished));
  let slugTouched = $state(untrack(() => Boolean(initialSlug)));

  let serializedTags = $derived(JSON.stringify(tags));

  $effect(() => {
    if (!slugTouched) slug = slugify(title);
  });

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

  async function deletePendingCover(key: string | null): Promise<void> {
    if (!key || key === initialCoverKey) return;
    await fetch(`/account/news/media/${key}`, { method: "DELETE" }).catch(
      () => undefined,
    );
  }

  async function uploadCover(file: File): Promise<void> {
    const validationError = validateNewsCover(file);
    if (validationError) {
      coverError = validationError;
      return;
    }

    const previousKey = coverKey;
    const localUrl = URL.createObjectURL(file);
    coverPreviewUrl = localUrl;
    coverError = null;
    uploadingCover = true;

    try {
      const form = new FormData();
      form.set("cover", file);
      const response = await fetch("/account/news/media", {
        method: "POST",
        body: form,
      });
      const result = (await response.json().catch(() => ({}))) as {
        key?: string;
        url?: string;
        message?: string;
      };
      if (!response.ok || !result.key || !result.url) {
        throw new Error(result.message ?? "Не удалось загрузить изображение");
      }

      coverKey = result.key;
      coverPreviewUrl = result.url;
      await deletePendingCover(previousKey);
    } catch (error) {
      coverKey = previousKey;
      coverPreviewUrl = newsCoverUrl(previousKey);
      coverError =
        error instanceof Error
          ? error.message
          : "Не удалось загрузить изображение";
    } finally {
      URL.revokeObjectURL(localUrl);
      uploadingCover = false;
    }
  }

  async function handleCoverChange(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) await uploadCover(file);
    input.value = "";
  }

  async function removeCover(): Promise<void> {
    const previousKey = coverKey;
    coverKey = null;
    coverPreviewUrl = null;
    coverError = null;
    await deletePendingCover(previousKey);
  }
</script>

<form
  method="POST"
  {action}
  enctype="multipart/form-data"
  class="flex flex-col gap-5"
>
  <input type="hidden" name="cover_key" value={coverKey ?? ""} />
  <input type="hidden" name="tags" value={serializedTags} />
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

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-4">
        <label
          for="news-tag"
          class="text-[9px] tracking-widest text-neutral-500">ТЕГИ</label
        >
        <span class="text-[8px] tracking-wider text-neutral-600"
          >{tags.length}/{MAX_NEWS_TAGS}</span
        >
      </div>

      <div class="flex flex-wrap gap-2">
        {#each tags as tag, index (`${tag}-${index}`)}
          <span
            class="flex items-center gap-2 border border-grass-dim/70 bg-grass-dim/10 px-2 py-1.5 text-[9px] text-grass"
          >
            {tag}
            <button
              type="button"
              onclick={() => removeTag(index)}
              class="text-neutral-500 transition-colors hover:text-white"
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
              class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[10px] text-neutral-100 outline-none placeholder:text-neutral-700"
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
  </section>

  <section class="mc-panel space-y-4 p-5 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="space-y-1">
        <h2 class="text-[9px] tracking-widest text-neutral-500">
          ОСНОВНОЕ ИЗОБРАЖЕНИЕ
        </h2>
        <p class="text-[8px] leading-relaxed text-neutral-600">
          JPEG, PNG или WebP · до 5 МБ · лучше 16:9
        </p>
      </div>
      {#if coverPreviewUrl}
        <button
          type="button"
          onclick={removeCover}
          disabled={uploadingCover}
          class="inline-flex items-center gap-2 text-[8px] tracking-widest text-red-400 transition-colors hover:text-red-300 disabled:opacity-40"
        >
          <PixelIcon name="trash" size={10} />
          УБРАТЬ
        </button>
      {/if}
    </div>

    <button
      type="button"
      onclick={() => coverInput?.click()}
      disabled={uploadingCover}
      class="group relative aspect-video w-full overflow-hidden border border-dashed border-white/15 bg-black/20 transition-colors hover:border-grass-dim disabled:cursor-wait"
    >
      {#if coverPreviewUrl}
        <img
          src={coverPreviewUrl}
          alt="Предпросмотр обложки"
          class="h-full w-full object-cover"
        />
        <span
          class="absolute inset-0 grid place-items-center bg-black/65 text-[9px] tracking-widest opacity-0 transition-opacity group-hover:opacity-100"
        >
          {uploadingCover ? "ЗАГРУЗКА…" : "ЗАМЕНИТЬ ИЗОБРАЖЕНИЕ"}
        </span>
      {:else}
        <span
          class="flex h-full flex-col items-center justify-center gap-3 px-4 text-[9px] tracking-widest text-neutral-500"
        >
          <PixelIcon name="image" size={28} class="text-neutral-700" />
          {uploadingCover ? "ЗАГРУЗКА…" : "ВЫБРАТЬ ИЗОБРАЖЕНИЕ"}
        </span>
      {/if}
    </button>
    <input
      bind:this={coverInput}
      type="file"
      name="cover"
      accept="image/jpeg,image/png,image/webp"
      onchange={handleCoverChange}
      class="sr-only"
    />

    {#if coverError}
      <p class="text-[9px] leading-relaxed text-red-400">{coverError}</p>
    {/if}
  </section>

  <details class="mc-panel group p-4">
    <summary
      class="flex cursor-pointer list-none items-center gap-2 text-[9px] tracking-widest text-neutral-400 transition-colors hover:text-white"
    >
      <PixelIcon
        name="arrow-right"
        size={9}
        class="transition-transform group-open:rotate-90 motion-reduce:transition-none"
      />
      ШПАРГАЛКА MARKDOWN
    </summary>
    <div
      class="mt-4 grid gap-3 border-t border-white/5 pt-4 text-[9px] leading-loose text-neutral-500 sm:grid-cols-2"
    >
      <code># Заголовок<br />## Подзаголовок<br />**жирный** и *курсив*</code>
      <code
        >- пункт списка<br />> цитата<br />[ссылка](https://example.com)</code
      >
    </div>
  </details>

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
