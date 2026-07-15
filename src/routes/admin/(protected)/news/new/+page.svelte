<script lang="ts">
  import NewsForm from "$lib/components/admin/NewsForm.svelte";

  let { form } = $props();
</script>

<h1 class="text-sm text-neutral-100">Новая новость</h1>

<NewsForm submitLabel="Создать" errorMessage={form?.errorMessage ?? null} />
