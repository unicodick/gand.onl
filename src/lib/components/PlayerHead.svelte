<script lang="ts">
  let { username, src }: { username: string; src: string } = $props();
</script>

<a
  href={`/u/${username}`}
  class="group relative block size-16 outline-none"
  aria-label={`Профиль игрока ${username}`}
  title={username}
>
  <img
    {src}
    alt=""
    width="64"
    height="64"
    loading="lazy"
    class="pixelated size-16 transition-all duration-150 group-hover:-translate-y-1 group-hover:drop-shadow-[0_5px_0_rgba(77,124,42,0.75)] group-focus-visible:-translate-y-1 group-focus-visible:drop-shadow-[0_5px_0_rgba(77,124,42,0.75)] motion-reduce:transition-none"
  />
  <span
    class="pointer-events-none absolute top-full left-1/2 z-20 mt-3 max-w-44 -translate-x-1/2 scale-95 border border-neutral-700 bg-black px-2.5 py-2 text-[9px] leading-none whitespace-nowrap text-neutral-100 opacity-0 shadow-[0_3px_0_rgba(0,0,0,0.7)] transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
    aria-hidden="true"
  >
    {username}
  </span>
</a>
