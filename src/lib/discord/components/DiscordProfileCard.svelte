<script lang="ts">
  import type { PublicDiscordProfile } from "$lib/discord/model";
  import PixelIcon from "$lib/ui/PixelIcon.svelte";

  let { profile }: { profile: PublicDiscordProfile } = $props();
</script>

<a
  href={profile.profileUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="mc-panel group flex min-w-0 items-center gap-3 px-4 py-3"
  aria-label={`Открыть Discord-профиль ${profile.displayName}`}
>
  <img
    src={profile.avatarUrl}
    alt=""
    width="48"
    height="48"
    class="size-10 shrink-0 bg-neutral-900"
  />

  <span class="min-w-0 flex-1 space-y-1">
    <span class="block text-[8px] tracking-widest text-neutral-500"
      >DISCORD</span
    >
    <span class="block truncate text-[10px] text-neutral-200">
      {profile.displayName}
    </span>
    <span class="block truncate text-[8px] text-neutral-500">
      @{profile.username}
    </span>
  </span>

  <PixelIcon
    name="external-link"
    size={13}
    class="text-neutral-600 transition-colors group-hover:text-neutral-300"
  />
</a>
