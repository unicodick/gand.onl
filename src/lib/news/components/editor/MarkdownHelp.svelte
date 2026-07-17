<script lang="ts">
  import PixelIcon from "$lib/components/PixelIcon.svelte";
</script>

<details class="mc-panel group p-4">
  <summary
    class="flex cursor-pointer list-none items-center gap-2 text-[9px] tracking-widest text-neutral-400 transition-colors hover:text-white"
  >
    <PixelIcon
      name="arrow-right"
      size={9}
      class="transition-transform group-open:rotate-90 motion-reduce:transition-none"
    />
    ШПАРГАЛКА MARKDOWN
  </summary>
  <div
    class="mt-4 grid gap-3 border-t border-white/5 pt-4 text-[9px] leading-loose text-neutral-500 sm:grid-cols-2"
  >
    <code># Заголовок<br />## Подзаголовок<br />**жирный** и *курсив*</code>
    <code>- пункт списка<br />> цитата<br />[ссылка](https://example.com)</code>
  </div>
</details>
