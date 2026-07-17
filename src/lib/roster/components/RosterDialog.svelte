<script lang="ts">
  import PixelIcon from "$lib/ui/PixelIcon.svelte";

  let dialog = $state<HTMLDialogElement>();

  function openDialog(): void {
    dialog?.showModal();
  }

  function closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) dialog?.close();
  }
</script>

<button
  type="button"
  class="mc-tab bg-white/3 px-3 py-2 text-[9px] tracking-wide text-neutral-500 hover:text-neutral-200"
  aria-haspopup="dialog"
  aria-controls="roster-dialog"
  onclick={openDialog}
>
  ROSTER
</button>

<dialog
  bind:this={dialog}
  id="roster-dialog"
  aria-labelledby="roster-title"
  aria-describedby="roster-description"
  class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto bg-transparent p-1 text-neutral-300 backdrop:bg-black/80"
  onclick={closeOnBackdrop}
>
  <section class="mc-panel space-y-6 p-5 sm:p-6">
    <header class="flex items-start justify-between gap-4">
      <div class="space-y-2">
        <p class="text-[8px] tracking-widest text-gold">ЗАКРЫТЫЙ ПРОЕКТ</p>
        <h3 id="roster-title" class="text-sm text-neutral-100">Roster API</h3>
      </div>
      <form method="dialog">
        <button
          type="submit"
          class="mc-tab grid size-8 place-items-center"
          aria-label="Закрыть информацию о Roster API"
        >
          <PixelIcon name="close" size={10} />
        </button>
      </form>
    </header>

    <div
      id="roster-description"
      class="space-y-4 text-[9px] leading-loose text-neutral-500 sm:text-[10px]"
    >
      <p>
        Roster — внутренний API gand.onl. Клиентский мод, запущенный обычным
        игроком, раз в десять минут читает доступный ему список игроков в tab
        list zlp.onl и передаёт на gand.onl только их ники.
      </p>
      <p>
        Так пополняется <a
          href="/players"
          class="text-grass underline decoration-grass-dim underline-offset-4"
          >страница /players</a
        > — каталог игроков, которых мод когда-либо видел. Это не текущий онлайн:
        статус и число игроков в footer поступают отдельно через mcsrvstat.us.
      </p>
      <p>Мод и API сейчас не предоставляются публично.</p>
    </div>

    <p
      class="border-l-2 border-neutral-700 pl-3 text-[8px] leading-loose text-neutral-600"
    >
      gand.onl — независимый сайт сообщества. Мы не являемся владельцами или
      администрацией zlp.onl и не имеем доступа к серверной инфраструктуре.
    </p>
  </section>
</dialog>
