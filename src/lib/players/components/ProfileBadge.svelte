<script lang="ts">
  import type { PixelIconName } from "$lib/ui/icons";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";

  let {
    icon,
    label,
    class: className = "",
  }: {
    icon: PixelIconName;
    label: string;
    class?: string;
  } = $props();

  const uid = $props.id();
  const tooltipId = `${uid}-tooltip`;
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (tooltip trigger is focusable without button semantics) -->
<span
  class="group relative grid size-6 cursor-help place-items-center outline-none transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current {className}"
  role="img"
  tabindex="0"
  aria-labelledby={tooltipId}
>
  <PixelIcon name={icon} size={16} />
  <span
    id={tooltipId}
    role="tooltip"
    class="pointer-events-none absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 scale-95 border border-neutral-700 bg-black px-2.5 py-2 text-[10px] leading-none whitespace-nowrap text-neutral-100 opacity-0 shadow-[0_3px_0_rgba(0,0,0,0.7)] transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100 motion-reduce:transition-none"
  >
    {label}
  </span>
</span>
