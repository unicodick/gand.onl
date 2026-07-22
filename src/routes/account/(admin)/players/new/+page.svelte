<script lang="ts">
  import PixelIcon from "$lib/ui/PixelIcon.svelte";

  let { form } = $props();
</script>

<h1 class="text-sm text-neutral-100">Новый игрок</h1>

<form method="POST" class="mc-panel panel-in flex flex-col gap-4 p-6">
  {#if form?.errorMessage}
    <p class="text-[10px] text-red-400">{form.errorMessage}</p>
  {/if}

  <label
    class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-400"
  >
    НИК MINECRAFT
    <input
      name="username"
      required
      class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
    />
  </label>

  <button
    type="submit"
    class="mc-panel mc-tab inline-flex items-center justify-center gap-2 px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
  >
    <PixelIcon name="plus" size={10} />
    Добавить
  </button>
</form>
