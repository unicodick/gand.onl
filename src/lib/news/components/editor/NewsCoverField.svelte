<script lang="ts">
  import { untrack } from "svelte";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";
  import { newsCoverUrl, validateNewsCover } from "$lib/news/model";

  let {
    initialCoverKey = null,
    coverKey = $bindable(null),
    uploading = $bindable(false),
  }: {
    initialCoverKey?: string | null;
    coverKey?: string | null;
    uploading?: boolean;
  } = $props();

  let coverPreviewUrl = $state<string | null>(
    untrack(() => newsCoverUrl(initialCoverKey)),
  );
  let coverInput = $state<HTMLInputElement>();
  let coverError = $state<string | null>(null);

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
    uploading = true;

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
      uploading = false;
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

<input type="hidden" name="cover_key" value={coverKey ?? ""} />

<section class="mc-panel space-y-4 p-5 sm:p-6">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="space-y-1">
      <h2 class="text-[10px] tracking-widest text-neutral-400">
        ОСНОВНОЕ ИЗОБРАЖЕНИЕ
      </h2>
      <p class="text-[10px] leading-relaxed text-neutral-400">
        JPEG, PNG или WebP · до 5 МБ · лучше 16:9
      </p>
    </div>
    {#if coverPreviewUrl}
      <button
        type="button"
        onclick={removeCover}
        disabled={uploading}
        class="inline-flex items-center gap-2 text-[10px] tracking-widest text-red-400 transition-colors hover:text-red-300 disabled:opacity-40"
      >
        <PixelIcon name="trash" size={10} />
        УБРАТЬ
      </button>
    {/if}
  </div>

  <button
    type="button"
    onclick={() => coverInput?.click()}
    disabled={uploading}
    class="group relative aspect-video w-full overflow-hidden border border-dashed border-white/15 bg-black/20 transition-colors hover:border-grass-dim disabled:cursor-wait"
  >
    {#if coverPreviewUrl}
      <img
        src={coverPreviewUrl}
        alt="Предпросмотр обложки"
        class="h-full w-full object-cover"
      />
      <span
        class="absolute inset-0 grid place-items-center bg-black/65 text-[10px] tracking-widest opacity-0 transition-opacity group-hover:opacity-100"
      >
        {uploading ? "ЗАГРУЗКА…" : "ЗАМЕНИТЬ ИЗОБРАЖЕНИЕ"}
      </span>
    {:else}
      <span
        class="flex h-full flex-col items-center justify-center gap-3 px-4 text-[10px] tracking-widest text-neutral-400"
      >
        <PixelIcon name="image" size={28} class="text-neutral-400" />
        {uploading ? "ЗАГРУЗКА…" : "ВЫБРАТЬ ИЗОБРАЖЕНИЕ"}
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
    <p class="text-[10px] leading-relaxed text-red-400">{coverError}</p>
  {/if}
</section>
