<script lang="ts">
  import { Playlist } from "../../playlist.svelte";

  let { playlist }: { playlist: ReturnType<typeof Playlist> } = $props();

  const {
    album: { art },
    track: { title, artist },
  } = playlist;
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
