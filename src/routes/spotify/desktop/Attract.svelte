<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { browser } from "$app/environment";
  import { Playlist } from "../playlist.svelte";

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
</script>

{#if visible}
  {@const {
    album: { art },
    track: { title, artist },
  } = playlist}

  <button
    class="flex h-screen w-screen flex-col items-center justify-center bg-slate-200"
    in:fade
    out:fade
    onclick={() => {
      visible = false;
    }}
  >
    <div class="inline-flex w-full flex-nowrap">
      {#each Array(2) as _, n}
        <div
          class="ml-1 flex animate-infinite-scroll items-center justify-center space-x-1 opacity-50"
        >
          {#each playlist.albums as album, n}
            <img class="aspect-square h-32 w-32 max-w-none" src={album.art} alt="art" />
          {/each}
        </div>
      {/each}
    </div>
    <div class="mt-4 inline-flex w-full flex-nowrap">
      {#each Array(2) as _, n}
        <div
          class="ml-1 flex animate-infinite-scroll-reverse items-center justify-center space-x-1 opacity-50"
        >
          {#each playlist.albums as album, n}
            <img class="aspect-square h-32 w-32 max-w-none" src={album.art} alt="art" />
          {/each}
        </div>
      {/each}
    </div>

    <div class="fixed inset-0 flex flex-col items-center justify-center">
      {#if art != ""}
        <div class="mb-20 rounded bg-white p-2 shadow-xl">
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
