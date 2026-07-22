<script lang="ts">
  import NewsForm from "$lib/news/components/editor/NewsForm.svelte";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";

  let { data, form } = $props();
</script>

<h1 class="text-sm text-neutral-100">Редактировать новость</h1>

{#key data.news.id}
  <NewsForm
    action="?/update"
    submitLabel="Сохранить"
    title={form?.values?.title ?? data.news.title}
    slug={form?.values?.slug ?? data.news.slug}
    body={form?.values?.body ?? data.news.body}
    coverKey={form?.values?.coverKey ?? data.news.cover_key}
    tags={form?.values?.tags ?? data.news.tags}
    publishedAt={form?.values?.publishedAt ?? data.news.published_at}
    published={form?.values?.published ?? Boolean(data.news.published)}
    errorMessage={form?.errorMessage ?? null}
  />
{/key}

<form
  method="POST"
  action="?/delete"
  onsubmit={(e) => {
    if (!confirm("Удалить новость безвозвратно?")) e.preventDefault();
  }}
>
  <button
    type="submit"
    class="mc-panel mc-tab flex w-full items-center justify-center gap-2 px-4 py-3 text-[10px] tracking-widest text-red-400 hover:text-red-300"
  >
    <PixelIcon name="trash" size={11} />
    УДАЛИТЬ НОВОСТЬ
  </button>
</form>
