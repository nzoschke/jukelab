<script lang="ts">
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

  const themeSpec = $derived(getTheme($theme));
  const messageStyle = $derived.by(() => {
    const shadows = [
      themeSpec.themeColors?.gradient1 || "#fff",
      themeSpec.themeColors?.gradient2 || "#fff",
      themeSpec.themeColors?.gradient3 || "#ff00ff",
      themeSpec.themeColors?.gradient4 || "#ff00ff",
      themeSpec.themeColors?.gradient5 || "#ff00ff",
    ];
    const textShadow = shadows.map((s, i) => `0 0 ${10 + i * 10}px ${s}`).join(", ");
    return `color: white; text-shadow: ${textShadow};`;
  });

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
      style={messageStyle}
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
</style>
