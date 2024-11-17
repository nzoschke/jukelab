<script lang="ts">
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import { Playlist } from "../playlist.svelte";

  let {
    onclose,
    playlist,
    visible = $bindable(false),
  }: {
    onclose: () => void;
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
    class="hero absolute left-0 top-0 min-h-screen bg-base-100"
    in:fade
    out:fade
    onclick={() => {
      visible = false;
      onclose();
    }}
  >
    <div class="hero-content h-full flex-col justify-start">
      <div class="relative h-20 w-screen">
        {#key message}
          <h1
            class="absolute left-1/2 -translate-x-1/2 text-5xl font-bold"
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          >
            {message}
          </h1>
        {/key}
      </div>
      {#if art != ""}
        <img class=" aspect-square h-4/6" src={art} alt="" />
      {/if}

      <div class="truncate">{title}</div>
      <div class="truncate font-bold">{artist}</div>
    </div>
  </button>
{/if}
