<script lang="ts">
  import NewsForm from "$lib/components/admin/NewsForm.svelte";

  let { form } = $props();
</script>

<h1 class="text-sm text-neutral-100">Новая новость</h1>

<NewsForm
  submitLabel="Создать"
  title={form?.values?.title}
  slug={form?.values?.slug}
  body={form?.values?.body}
  coverKey={form?.values?.coverKey || null}
  tags={form?.values?.tags}
  publishedAt={form?.values?.publishedAt}
  published={form?.values?.published}
  errorMessage={form?.errorMessage ?? null}
/>
