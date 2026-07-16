<script lang="ts">
  let { data, form } = $props();
</script>

<h1 class="text-sm text-neutral-100">Игрок — {data.player.username}</h1>

<form
  method="POST"
  action="?/setOwner"
  class="mc-panel panel-in flex flex-col gap-4 p-6"
>
  {#if form?.errorMessage}
    <p class="text-[10px] text-red-400">{form.errorMessage}</p>
  {/if}

  <label
    class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
  >
    DISCORD ID ВЛАДЕЛЬЦА
    <input
      name="owner_discord_id"
      value={data.player.owner_discord_id ?? ""}
      placeholder="пусто = не привязан"
      class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
    />
  </label>

  <button
    type="submit"
    class="mc-panel mc-tab px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
  >
    Сохранить
  </button>
</form>

<form method="POST" action="?/delete">
  <button
    type="submit"
    class="mc-panel mc-tab w-full px-4 py-3 text-center text-[10px] tracking-widest text-red-400 hover:text-red-300"
  >
    Удалить игрока
  </button>
</form>
