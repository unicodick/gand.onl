<script lang="ts">
  import NewsForm from "$lib/components/admin/NewsForm.svelte";

  let { data, form } = $props();
</script>

<h1 class="text-sm text-neutral-100">Редактировать новость</h1>

{#key data.news.id}
  <NewsForm
    action="?/update"
    submitLabel="Сохранить"
    title={data.news.title}
    slug={data.news.slug}
    body={data.news.body}
    coverKey={data.news.cover_key}
    tags={data.news.tags}
    published={Boolean(data.news.published)}
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
    class="mc-panel mc-tab w-full px-4 py-3 text-[10px] tracking-widest text-red-400 hover:text-red-300"
  >
    УДАЛИТЬ НОВОСТЬ
  </button>
</form>
