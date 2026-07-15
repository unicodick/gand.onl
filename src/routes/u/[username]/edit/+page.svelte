<script lang="ts">
  import { untrack } from "svelte";
  import { BRAND } from "$lib/creators";
  import { PROSE_CLASS, renderMarkdown } from "$lib/markdown";
  import { SOCIAL_PLATFORMS } from "$lib/socials";

  let { data, form } = $props();

  let bio = $state(untrack(() => data.player.bio ?? ""));
  let socialValues = $state(
    untrack(() =>
      Object.fromEntries(
        SOCIAL_PLATFORMS.map((platform) => [
          platform.id,
          data.socials.find((s) => s.platform === platform.id)?.url ?? "",
        ]),
      ),
    ),
  );

  let previewHtml = $derived(bio ? renderMarkdown(bio) : "");
</script>

<svelte:head>
  <title>Редактирование — {data.player.username} — {BRAND}</title>
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col items-center px-4 pt-24 pb-40 sm:pt-28"
>
  <div class="flex w-full max-w-2xl flex-col gap-6">
    <h1 class="text-sm text-neutral-100">
      Редактирование профиля — {data.player.username}
    </h1>

    <form method="POST" class="mc-panel panel-in flex flex-col gap-4 p-6">
      {#if form?.errorMessage}
        <p class="text-[10px] text-red-400">{form.errorMessage}</p>
      {/if}

      <div class="grid gap-4 md:grid-cols-2">
        <label
          class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
        >
          О СЕБЕ (MARKDOWN)
          <textarea
            name="bio"
            bind:value={bio}
            rows="10"
            maxlength="2000"
            class="mc-panel bg-transparent px-3 py-2 text-xs leading-relaxed text-neutral-100 outline-none"
          ></textarea>
        </label>

        <div
          class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
        >
          ПРЕВЬЮ
          <div
            class={`mc-panel min-h-40 flex-1 overflow-auto px-3 py-2 text-xs text-neutral-200 ${PROSE_CLASS}`}
          >
            {@html previewHtml}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <p class="text-[10px] tracking-widest text-neutral-500">СОЦСЕТИ</p>
        {#each SOCIAL_PLATFORMS as platform (platform.id)}
          <label
            class="flex flex-col gap-1 text-[10px] tracking-widest text-neutral-500"
          >
            {platform.label.toUpperCase()}
            <input
              name={`social_${platform.id}`}
              bind:value={socialValues[platform.id]}
              placeholder="https://"
              class="mc-panel bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none"
            />
          </label>
        {/each}
      </div>

      <button
        type="submit"
        class="mc-panel mc-tab px-4 py-3 text-[10px] tracking-widest text-neutral-200 hover:text-white"
      >
        Сохранить
      </button>
    </form>
  </div>
</main>
