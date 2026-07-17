<script lang="ts">
  import { API_LINKS, BRAND, CONTACT_LINKS } from "$lib/creators";
</script>

<svelte:head>
  <title>Связь — {BRAND}</title>
  <meta name="description" content="контакты детей спавна" />
</svelte:head>

<main class="flex w-full flex-1 flex-col items-center px-4 py-12 sm:py-16">
  <section
    class="grid w-full max-w-4xl gap-8 md:grid-cols-[minmax(0,1fr)_320px]"
  >
    <div class="flex flex-col justify-center gap-8">
      <div class="space-y-4">
        <p class="text-[10px] tracking-widest text-neutral-500">СВЯЗЬ</p>
        <h1
          class="max-w-xl text-2xl leading-relaxed text-neutral-100 sm:text-3xl"
        >
          Вопросы по проекту и исходники
        </h1>
        <p
          class="max-w-xl text-[10px] leading-relaxed text-neutral-500 sm:text-xs"
        >
          Пишите по багам, идеям и вопросам. Быстрее всего отвечаю в Discord,
          код проекта лежит на GitHub.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each CONTACT_LINKS as link (link.href)}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="mc-panel px-4 py-3 text-[10px] tracking-widest text-neutral-300 transition-colors hover:text-white sm:text-xs"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <div class="space-y-3">
        <h2 class="text-xs tracking-widest text-neutral-300">
          ИСТОЧНИКИ ДАННЫХ
        </h2>
        <p class="max-w-xl text-[9px] leading-relaxed text-neutral-600">
          Статус и текущий онлайн получаем через mcsrvstat.us, изображения
          скинов — через NMSR.
        </p>
        <div class="flex flex-wrap gap-2">
          {#each API_LINKS as api (api.href)}
            <a
              href={api.href}
              target="_blank"
              rel="noopener noreferrer"
              class="mc-tab bg-white/3 px-3 py-2 text-[9px] tracking-wide text-neutral-500 hover:text-neutral-200"
            >
              {api.label}
            </a>
          {/each}
        </div>
      </div>
    </div>

    <img
      src="/contact.webp"
      alt="связь.вебп"
      width="716"
      height="704"
      class="pixelated w-full max-w-80 justify-self-center border-4 border-black shadow-[0_0_0_2px_#27272a,0_10px_0_rgba(0,0,0,0.35)] md:self-center"
    />
  </section>
</main>
