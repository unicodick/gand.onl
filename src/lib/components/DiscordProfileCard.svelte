<script lang="ts">
  import type { PublicDiscordProfile } from "$lib/discord";

  let { profile }: { profile: PublicDiscordProfile } = $props();
</script>

<a
  href={profile.profileUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="group flex min-w-0 items-center gap-3 border border-[#5865f2]/35 bg-[#5865f2]/8 p-3 transition-colors hover:border-[#5865f2]/70 hover:bg-[#5865f2]/12 sm:p-4"
  aria-label={`Открыть Discord-профиль ${profile.displayName}`}
>
  <img
    src={profile.avatarUrl}
    alt=""
    width="48"
    height="48"
    class="size-10 shrink-0 bg-neutral-900 sm:size-12"
  />

  <span class="min-w-0 flex-1 space-y-1">
    <span class="block text-[8px] tracking-widest text-[#9da5ff]">
      DISCORD
    </span>
    <span class="block truncate text-[10px] text-neutral-100 sm:text-xs">
      {profile.displayName}
    </span>
    <span class="block truncate text-[8px] text-neutral-500">
      @{profile.username}
    </span>
  </span>

  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    class="shrink-0 text-neutral-600 transition-colors group-hover:text-[#9da5ff]"
    aria-hidden="true"
  >
    <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" stroke-width="1.5" />
  </svg>
</a>
