<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Playlist } from "../../playlist.svelte";

  let { playlist }: { playlist: ReturnType<typeof Playlist> } = $props();

  const {
    album: { art },
    track: { title, artist },
  } = $derived(playlist);

  type DVD = {
    art: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
  };

  const size = 200; // width and height, in px
  const speed = 2;

  let albums: DVD[] = $state([]);

  $effect(() => {
    if (!art) {
      return;
    }

    if (albums.length === 0 || albums[0].art !== art) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const vx = Math.random() < 0.5 ? speed : -speed;
      const vy = Math.random() < 0.5 ? speed : -speed;
      const x = vx > 0 ? 0 : screenWidth - size;
      const y = vy > 0 ? 0 : screenHeight - size;

      albums = [{ art, x, y, vx, vy }, ...albums];
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
        if (album.x < 0 || album.x + size > screenWidth) {
          album.vx = -album.vx;
        }
        if (album.y < 0 || album.y + size > screenHeight) {
          album.vy = -album.vy;
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
