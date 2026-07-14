<script lang="ts">
  import { LINKS } from "$lib/creators";
</script>

<footer
  class="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5"
>
  <div
    class="mc-panel panel-in flex items-center gap-1.5 p-1.5 text-[10px] tracking-widest sm:gap-2 sm:text-xs"
  >
    {#each LINKS as link, i (link.href)}
      {#if i > 0}
        <span class="mc-divider" aria-hidden="true"></span>
      {/if}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        class="mc-tab px-2.5 py-1.5 text-neutral-400"
      >
        {link.label}
      </a>
    {/each}
  </div>

  <p
    class="max-w-xs text-center text-[8px] leading-relaxed tracking-wide text-neutral-600 sm:text-[9px]"
  >
    Мы не являемся администрацией или владельцами zlp.onl.<br />
    Not affiliated with Minecraft, Mojang or Microsoft.
  </p>
</footer>
