<script lang="ts">
  import type { PixelIconName } from "$lib/icons";
  import PixelIcon from "./PixelIcon.svelte";

  let {
    icon,
    label,
    class: className = "",
  }: {
    icon: PixelIconName;
    label: string;
    class?: string;
  } = $props();
</script>

<details class="group relative {className}">
  <summary
    class="grid size-6 cursor-help list-none place-items-center outline-none transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current [&::-webkit-details-marker]:hidden"
    aria-label={label}
  >
    <PixelIcon name={icon} size={16} />
  </summary>
  <span
    role="tooltip"
    class="pointer-events-none absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 scale-95 border border-neutral-700 bg-black px-2.5 py-2 text-[8px] leading-none whitespace-nowrap text-neutral-100 opacity-0 shadow-[0_3px_0_rgba(0,0,0,0.7)] transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 group-open:scale-100 group-open:opacity-100 motion-reduce:transition-none"
  >
    {label}
  </span>
</details>
