<script lang="ts">
  import { asset } from "$app/paths";
  import type { PixelIconName } from "$lib/ui/icons";

  let {
    name,
    size = 16,
    label,
    class: className = "",
  }: {
    name: PixelIconName;
    size?: number;
    label?: string;
    class?: string;
  } = $props();

  let iconUrl = $derived(asset(`/icons/pixel/${name}.svg`));
</script>

<span
  class="pixel-icon {className}"
  style={`--pixel-icon: url("${iconUrl}"); width: ${size}px; height: ${size}px;`}
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
></span>

<style>
  .pixel-icon {
    display: inline-block;
    flex: none;
    background-color: currentColor;
    -webkit-mask: var(--pixel-icon) center / contain no-repeat;
    mask: var(--pixel-icon) center / contain no-repeat;
  }
</style>
