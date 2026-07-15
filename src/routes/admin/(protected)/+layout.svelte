<script lang="ts">
  let { data, children } = $props();
</script>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <div class="flex w-full max-w-3xl flex-col gap-6">
    <div
      class="mc-panel panel-in flex items-center justify-between px-4 py-3 text-[10px] tracking-widest"
    >
      <a href="/admin" class="text-neutral-300 hover:text-white">АДМИНКА</a>
      <div class="flex items-center gap-3">
        <span class="text-neutral-500">{data.user.username}</span>
        <form method="POST" action="/admin/logout">
          <button type="submit" class="text-neutral-400 hover:text-white"
            >ВЫЙТИ</button
          >
        </form>
      </div>
    </div>

    {@render children()}
  </div>
</main>
