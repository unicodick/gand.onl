<script lang="ts">
  import "../app.css";
  import { asset } from "$app/paths";
  import Header from "$lib/ui/Header.svelte";
  import Footer from "$lib/ui/Footer.svelte";

  let { children } = $props();

  $effect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) return;
    const happy = asset("/favicon.svg");
    const sad = asset("/favicon-sad.svg");
    const update = () => {
      link.href = document.hidden ? sad : happy;
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  });
</script>

<div class="flex min-h-dvh flex-col">
  <Header />
  <div class="flex flex-1 flex-col">
    {@render children()}
  </div>
  <Footer />
</div>
