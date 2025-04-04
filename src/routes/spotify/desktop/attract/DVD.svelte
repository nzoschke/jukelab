<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Playlist } from "../../playlist.svelte";
  import { fade } from "svelte/transition";
  import { theme, getTheme } from "$lib/themes";

  let {
    playlist,
    message,
  }: {
    playlist: ReturnType<typeof Playlist>;
    message: string;
  } = $props();

  const messageColor = $derived(getTheme($theme).themeColors?.link || "");

  const {
    nowPlayingImage,
    track: { title, artist },
  } = $derived(playlist);

  type DVD = {
    art: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    inside: boolean;
  };

  const size = window.innerWidth / 5; // width and height, in px
  const speed = 2;

  let albums: DVD[] = $state([]);

  $effect(() => {
    if (!nowPlayingImage) {
      return;
    }

    if (albums.length === 0 || albums[0].art !== nowPlayingImage) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const vx = Math.random() < 0.5 ? speed : -speed;
      const vy = Math.random() < 0.5 ? speed : -speed;
      const x = vx > 0 ? -size : Math.random() * (screenWidth + size);
      const y = vy > 0 ? -size : Math.random() * (screenHeight + size);

      albums = [{ art: nowPlayingImage, x, y, vx, vy, inside: false }, ...albums];
    }
  });

  let animId: number;
  onMount(() => (animId = requestAnimationFrame(animate)));
  onDestroy(() => cancelAnimationFrame(animId));

  function animate() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let remove = [];

    for (const [index, album] of albums.entries()) {
      album.x += album.vx;
      album.y += album.vy;

      if (index === 0) {
        // active album, bounce
        if (!album.inside) {
          album.inside =
            album.x >= 0 &&
            album.x + size <= screenWidth &&
            album.y >= 0 &&
            album.y + size <= screenHeight;
        }
        if (album.inside) {
          if (album.x < 0 || album.x + size > screenWidth) {
            album.vx = -album.vx;
          }
          if (album.y < 0 || album.y + size > screenHeight) {
            album.vy = -album.vy;
          }
        }
      } else {
        // previous album, check if over bounds
        if (
          album.x < -size ||
          album.x > screenWidth + size ||
          album.y < -size ||
          album.y > screenHeight + size
        ) {
          remove.push(index);
        }
      }
    }

    albums = albums.filter((_, index) => !remove.includes(index));

    animId = requestAnimationFrame(animate);
  }
</script>

<div class="flex h-screen w-screen items-center justify-center">
  {#key message}
    <h1
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-4xl font-bold text-base-content"
      style="color: {messageColor}"
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 400 }}
    >
      {message}
    </h1>
  {/key}

  {#each albums as album (album.art)}
    <img
      src={album.art}
      alt=""
      class="absolute"
      style="width: {size}px; height: {size}px; left: {album.x}px; top: {album.y}px;"
    />
  {/each}

  <p class="absolute bottom-5 left-5 pt-2 text-xl italic">{title} by <b>{artist}</b></p>
</div>
