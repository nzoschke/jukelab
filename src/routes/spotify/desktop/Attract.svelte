<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { browser } from "$app/environment";
  import { Playlist } from "../playlist.svelte";
  import { pad } from "$lib/string";
  import { onMount } from "svelte";
  import type { AlbumTracks } from "$lib/types/music";
  import { chunk, shuffle } from "$lib/array";
  import Snow from "$lib/shared/snow.svelte";
  import { writable } from "svelte/store";
  import { holiday } from "./store";

  let {
    playlist,
    visible = $bindable(false),
  }: {
    playlist: ReturnType<typeof Playlist>;
    visible: boolean;
  } = $props();

  const defaultMessages = [
    "Welcome to JukeLab",
    "Press any key to continue",
    "Tap anywhere to start",
    "Select your favorite tunes",
  ];

  const holidayMessages = [
    "Happy Holidays!",
    "Tap anywhere for turkey",
    "Select your favorite holiday tunes",
  ];

  const messages = $derived($holiday ? holidayMessages : defaultMessages);

  let message = $state(messages[0]);
  let artTop = $state<AlbumTracks[]>([]);
  let artBottom = $state<AlbumTracks[]>([]);

  const reshuffle = () => {
    const shuffled = shuffle([...playlist.albums]);
    const chunks = chunk(shuffled, Math.ceil(shuffled.length / 2));
    artTop = chunks[0];
    artBottom = chunks[1];
  };

  onMount(() => {
    reshuffle();

    if (browser) {
      setInterval(() => {
        const i = messages.findIndex((m) => m == message);
        message = messages[(i + 1) % messages.length];
      }, 5000);
    }
  });

  $effect(() => {
    // reshuffle while invisible
    visible || reshuffle();
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
          {#each artTop as album, n}
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
          {#each artBottom as album, n}
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

  {#if $holiday}
    <Snow />
  {/if}
{/if}
