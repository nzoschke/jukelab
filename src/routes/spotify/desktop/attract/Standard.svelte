<script lang="ts">
  import { fade } from "svelte/transition";
  import { Playlist } from "../../playlist.svelte";
  import { onMount } from "svelte";
  import type { AlbumTracks } from "$lib/types/music";
  import { chunk, shuffle } from "$lib/array";
  import { theme, getTheme } from "$lib/themes";

  let {
    playlist,
    message,
  }: {
    playlist: ReturnType<typeof Playlist>;
    message: string;
  } = $props();

  let artTop = $state<AlbumTracks[]>([]);
  let artBottom = $state<AlbumTracks[]>([]);

  const messageColor = $derived(getTheme($theme).themeColors?.link || "");

  const reshuffle = () => {
    const shuffled = shuffle([...playlist.albums]);
    const chunks = chunk(shuffled, Math.ceil(shuffled.length / 2));
    artTop = chunks[0];
    artBottom = chunks[1];
  };

  onMount(() => {
    reshuffle();
  });

  const {
    nowPlayingImage,
    track: { title, artist },
  } = $derived(playlist);
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center pb-20">
  <div class="inline-flex w-full flex-nowrap">
    {#each [1, 2]}
      <div
        class="ml-1 flex animate-infinite-scroll items-center justify-center space-x-1 opacity-50"
      >
        {#each artTop as album (album.src)}
          <img class="aspect-square h-32 w-32 max-w-none" src={album.art} alt="art" />
        {/each}
      </div>
    {/each}
  </div>

  <div class="mt-1 inline-flex w-full flex-nowrap">
    {#each [1, 2]}
      <div
        class="ml-1 flex animate-infinite-scroll-reverse items-center justify-center space-x-1 opacity-50"
      >
        {#each artBottom as album (album.src)}
          <img class="aspect-square h-32 w-32 max-w-none" src={album.art} alt="art" />
        {/each}
      </div>
    {/each}
  </div>

  <div class="fixed inset-0 flex flex-col items-center justify-center pb-20">
    {#if nowPlayingImage != ""}
      <div class="w-[60vmin] rounded bg-white p-2 shadow-xl">
        <img class="aspect-square h-[60vmin] w-[60vmin] rounded" src={nowPlayingImage} alt="" />
        <p class="pt-2 italic">{title} by <b>{artist}</b></p>
      </div>
    {/if}
  </div>

  {#key message}
    <h1
      class="absolute bottom-20 left-1/2 -translate-x-1/2 transform text-center text-5xl font-bold"
      style="color: {messageColor}"
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 400 }}
    >
      {message}
    </h1>
  {/key}
</div>
