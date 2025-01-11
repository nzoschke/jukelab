<script lang="ts">
  import { Playlist } from "../../playlist.svelte";
  import { fade } from "svelte/transition";

  let {
    playlist,
    message,
  }: {
    playlist: ReturnType<typeof Playlist>;
    message: string;
  } = $props();

  const {
    album: { art },
    track: { title, artist },
  } = $derived(playlist);
</script>

<div class="flex h-screen w-screen items-center justify-center">
  {#if art != ""}
    <div
      class="vinyl flex size-full h-[90vmin] w-[90vmin] animate-[spin_2s_linear_infinite] items-center justify-center rounded-full"
    >
      <img class="h-2/3 w-2/3" src={art} alt="" />
    </div>

    <p class="absolute bottom-5 left-5 pt-2 text-xl italic">{title} by <b>{artist}</b></p>
  {/if}

  {#key message}
    <h1
      class="glow absolute left-1/2 top-1/2 mt-[32vmin] -translate-x-1/2 transform text-center text-4xl font-bold text-base-content"
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 400 }}
    >
      {message}
    </h1>
  {/key}
</div>

<style type="text/css">
  .vinyl {
    background-image: url("/vinyl.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .vinyl img {
    background-repeat: no-repeat;
    mask-image: radial-gradient(circle, black 70%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle, black 70%, transparent 70%);
  }
  .glow {
    color: #fff;
    opacity: 0.9;
    text-shadow:
      0 0 10px #ffffff,
      0 0 20px #ffffff,
      0 0 30px #ff00ff,
      0 0 40px #ff00ff,
      0 0 50px #ff00ff,
      0 0 75px #ff00ff;
  }
</style>
