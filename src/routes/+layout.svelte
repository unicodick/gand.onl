<script lang="ts">
  import "../app.css";
  import { asset } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";

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

<Header />
{@render children()}
<Footer />
