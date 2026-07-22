<script lang="ts">
  import { BRAND } from "$lib/site";
</script>

<svelte:head>
  <title>Конфиденциальность — {BRAND}</title>
  <meta
    name="description"
    content="Какие данные использует gand.onl, зачем они нужны и как запросить их исправление или удаление."
  />
</svelte:head>

<main class="flex w-full flex-1 justify-center px-4 py-12 sm:py-16">
  <article class="w-full max-w-3xl space-y-10">
    <header class="space-y-4">
      <p class="text-[10px] tracking-widest text-neutral-400">
        КОНФИДЕНЦИАЛЬНОСТЬ
      </p>
      <h1 class="text-2xl leading-relaxed text-neutral-100 sm:text-3xl">
        Политика конфиденциальности
      </h1>
      <p class="text-[9px] tracking-wide text-neutral-400">
        Действует с 22 июля 2026 года
      </p>
    </header>

    <section class="mc-panel space-y-4 p-5 sm:p-7">
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        gand.onl — независимый проект сообщества игроков zlp.onl. Его ведёт
        владелец gand.onl, игрок setunicode. Проект не принадлежит администрации
        или владельцам zlp.onl и не связан с Mojang или Microsoft.
      </p>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Эта страница объясняет, какие данные нужны сайту, откуда они берутся и
        как попросить об их исправлении или удалении.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Какие данные использует сайт
      </h2>
      <ul
        class="list-disc space-y-3 pl-5 text-[10px] leading-loose text-neutral-300 sm:text-xs"
      >
        <li>
          При входе через Discord: Discord ID, имя пользователя, отображаемое
          имя и идентификатор аватара. Сайт запрашивает только разрешение
          <span class="text-neutral-100">identify</span>. Токен доступа Discord
          используется для входа и не сохраняется.
        </li>
        <li>
          Для входа: временные cookies OAuth действуют до 5 минут. Случайный
          ключ сессии хранится в обязательном защищённом cookie, а его хеш,
          Discord ID, имя пользователя и срок действия — в базе данных. Сессия
          действует 7 дней. Других cookies gand.onl не устанавливает.
        </li>
        <li>
          Для каталога игроков: Minecraft-ник и служебные даты создания или
          обновления записи. Ники попадают в каталог из списка игроков, который
          видит обычный клиентский мод на zlp.onl. gand.onl не имеет доступа к
          инфраструктуре или административным инструментам сервера.
        </li>
        <li>
          Для добровольно привязанного профиля: описание, ссылка на скин,
          выбранные социальные ссылки и связь Minecraft-ника с Discord ID.
        </li>
        <li>
          Технические данные запросов, например IP-адрес, тип браузера и время
          обращения, могут обрабатываться Cloudflare для доставки и защиты
          сайта. gand.onl не использует рекламные или аналитические трекеры.
        </li>
      </ul>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Зачем это нужно
      </h2>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Данные используются только для входа, привязки Minecraft-ника,
        отображения и редактирования профиля, работы каталога игроков,
        публикации материалов, модерации и защиты проекта от злоупотреблений.
        Данные не продаются и не используются для рекламы.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Что видно другим
      </h2>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Minecraft-ники в каталоге публичны. Описание, скин и социальные ссылки
        становятся публичными, если владелец привязал ник и сам их добавил.
        Карточка Discord с аватаром, именем и ссылкой на профиль показывается
        только после включения этой опции в кабинете. Discord ID, ключ привязки
        и данные сессии публично не показываются.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Сторонние сервисы
      </h2>
      <ul
        class="list-disc space-y-3 pl-5 text-[10px] leading-loose text-neutral-300 sm:text-xs"
      >
        <li>
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-100 underline decoration-neutral-600 underline-offset-4 hover:text-white"
            >Cloudflare</a
          > — хостинг, база данных, хранение медиа и защита сайта.
        </li>
        <li>
          <a
            href="https://discord.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-100 underline decoration-neutral-600 underline-offset-4 hover:text-white"
            >Discord</a
          > — вход и, с разрешения пользователя, отображение Discord-профиля. При
          показе аватара браузер загружает его с серверов Discord.
        </li>
        <li>
          <a
            href="https://nmsr.nickac.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-100 underline decoration-neutral-600 underline-offset-4 hover:text-white"
            >NMSR</a
          > — рендер изображений Minecraft-скинов. При загрузке такого изображения
          сервис получает обычные технические данные веб-запроса.
        </li>
      </ul>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Если игрок указал собственную ссылку на скин, браузер загружает
        изображение с выбранного им сайта, и этот сайт также получает обычные
        технические данные запроса. Переход по внешним ссылкам подчиняется
        правилам соответствующих сайтов.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Срок хранения
      </h2>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Cookie сессии действует до 7 дней. После этого сессией нельзя
        воспользоваться; её техническая запись может оставаться в базе до
        очистки. Записи Discord-профиля, привязка ника, заполнение профиля и
        служебные записи модерации хранятся, пока они нужны для работы и защиты
        проекта либо пока не поступит подтверждённый запрос на удаление. Запись
        Minecraft-ника может обновляться при новых наблюдениях клиентского мода.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Исправление и удаление
      </h2>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Можно попросить показать, исправить или удалить связанные с вами данные,
        отвязать профиль либо убрать Minecraft-ник из каталога. Напишите на
        <a
          href="mailto:contact@gand.onl?subject=%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%20%D0%BF%D0%BE%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC"
          class="text-neutral-100 underline decoration-neutral-600 underline-offset-4 hover:text-white"
          >contact@gand.onl</a
        >. Чтобы не удалить чужие данные, может потребоваться подтверждение
        владения Discord-аккаунтом или Minecraft-ником. Не отправляйте больше
        личных данных, чем необходимо для обработки запроса, и не публикуйте их
        в GitHub Issues.
      </p>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Часть служебных записей может быть сохранена, если это необходимо для
        безопасности, разрешения спора или предотвращения повторного
        злоупотребления.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm leading-relaxed text-neutral-100 sm:text-base">
        Изменения политики
      </h2>
      <p class="text-[10px] leading-loose text-neutral-300 sm:text-xs">
        Если набор данных или работа сайта существенно изменятся, эта страница
        будет обновлена вместе с датой вступления изменений в силу.
      </p>
    </section>
  </article>
</main>
