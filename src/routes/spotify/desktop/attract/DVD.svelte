<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Playlist } from "../../playlist.svelte";

  let { playlist }: { playlist: ReturnType<typeof Playlist> } = $props();

  const {
    album: { art },
    track: { title, artist },
  } = playlist;

  // Position/velocity for the DVD logo
  let x = $state(0);
  let y = $state(0);
  let vx = 3;
  let vy = 3;

  // Logo size
  let logoWidth = 200;
  let logoHeight = 200;

  let animId: number;
  onMount(() => (animId = requestAnimationFrame(animate)));
  onDestroy(() => cancelAnimationFrame(animId));

  function animate() {
    x += vx;
    y += vy;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (x < 0 || x + logoWidth > screenWidth) {
      vx = -vx;
    }
    if (y < 0 || y + logoHeight > screenHeight) {
      vy = -vy;
    }

    animId = requestAnimationFrame(animate);
  }
</script>

<div class="flex h-screen w-screen items-center justify-center">
  {#if art != ""}
    <img
      src={art}
      alt=""
      class="absolute"
      style="width: {logoWidth}px; height: {logoHeight}px; left: {x}px; top: {y}px;"
    />
    <p class="absolute bottom-5 left-5 pt-2 text-xl italic">{title} by <b>{artist}</b></p>
  {/if}
</div>
