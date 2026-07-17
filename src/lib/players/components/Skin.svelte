<script lang="ts">
  let { name, src }: { name: string; src: string } = $props();
</script>

<div class="group relative flex flex-col items-center">
  <div
    class="pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 scale-95 border border-neutral-700 bg-black px-2 py-1 text-[10px] whitespace-nowrap text-neutral-200 opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100"
  >
    {name}
  </div>

  <img
    {src}
    alt={name}
    width="512"
    height="869"
    loading="eager"
    class="pixelated h-[42vh] w-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:-translate-y-2 sm:h-[56vh]"
  />
</div>
