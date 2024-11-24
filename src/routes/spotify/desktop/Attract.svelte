<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { browser } from "$app/environment";
  import { Playlist } from "../playlist.svelte";
  import { pad } from "$lib/string";
  import { onMount } from "svelte";
  import type { AlbumTracks } from "$lib/types/music";

  let {
    playlist,
    visible = $bindable(false),
  }: {
    playlist: ReturnType<typeof Playlist>;
    visible: boolean;
  } = $props();

  const messages = [
    "Welcome to JukeLab",
    "Press any key to continue",
    "Tap anywhere to start",
    "Select your favorite tunes",
  ];

  let message = $state(messages[0]);

  if (browser) {
    setInterval(() => {
      const i = messages.findIndex((m) => m == message);
      message = messages[(i + 1) % messages.length];
    }, 5000);
  }

  const shuffleArray = <T,>(array: T[]): T[] =>
    array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  let albums1: AlbumTracks[] = [];
  let albums2: AlbumTracks[] = [];
  const shuffleAlbums = () => {
    const shuffled = shuffleArray([...playlist.albums]);
    const half = Math.ceil(shuffled.length / 2);
    albums1 = shuffled.slice(0, half);
    albums2 = shuffled.slice(half);
  };

  onMount(() => shuffleAlbums());
  $effect(() => {
    if (!visible) {
      // shuffle while in background
      shuffleAlbums();
    }
  });
</script>

{#if visible}
  {@const {
    album: { art },
    track: { title, artist },
  } = playlist}

  <button
    class="flex h-screen w-screen flex-col items-center justify-center border bg-slate-200 pb-20"
    in:fade
    out:fade
    onclick={() => {
      visible = false;
    }}
  >
    <h1 class="absolute right-5 top-5 text-5xl text-base-300">
      Queue: {pad(playlist.queue.length)}
    </h1>

    <div class="inline-flex w-full flex-nowrap">
      {#each Array(2) as _, n}
        <div
          class="ml-1 flex animate-infinite-scroll items-center justify-center space-x-1 opacity-50"
        >
          {#each albums1 as album, n}
            <img class="aspect-square h-32 w-32 max-w-none" src={album.art} alt="art" />
          {/each}
        </div>
      {/each}
    </div>

    <div class="mt-1 inline-flex w-full flex-nowrap">
      {#each Array(2) as _, n}
        <div
          class="ml-1 flex animate-infinite-scroll-reverse items-center justify-center space-x-1 opacity-50"
        >
          {#each albums2 as album, n}
            <img class="aspect-square h-32 w-32 max-w-none" src={album.art} alt="art" />
          {/each}
        </div>
      {/each}
    </div>

    <div class="fixed inset-0 flex flex-col items-center justify-center pb-20">
      {#if art != ""}
        <div class="rounded bg-white p-2 shadow-xl">
          <img class="aspect-square h-[60vmin] w-[60vmin] rounded" src={art} alt="" />
          <p class="pt-2 italic">{title} by <b>{artist}</b></p>
        </div>
      {/if}
    </div>

    {#key message}
      <h1
        class="absolute bottom-20 left-1/2 -translate-x-1/2 transform text-5xl font-bold"
        in:fade={{ duration: 400 }}
        out:fade={{ duration: 400 }}
      >
        {message}
      </h1>
    {/key}
  </button>
{/if}
