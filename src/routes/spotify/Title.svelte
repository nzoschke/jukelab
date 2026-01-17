<script lang="ts">
  import type { Album, Track } from "$lib/types/music";

  let {
    album,
    track,
  }: {
    album?: Album;
    track: Track;
  } = $props();
</script>

{#snippet art(album?: Album)}
  {#if album && album.art != ""}
    <img alt="" class="aspect-square h-full" src={album.art} />
  {:else}
    <div class="aspect-square h-full"></div>
  {/if}
{/snippet}

<div
  class="flex h-24 min-h-24 w-1/2 items-center justify-center space-x-2 rounded bg-base-200 p-2"
  class:skeleton={!track.src}
>
  {@render art(album)}
  <div class="flex flex-col items-center text-center">
    <div class="truncate">{track.title}</div>
    <div class="truncate">
      {track.album}
      {track.year?.getTime() == 0 ? "" : `(${track.year?.getFullYear()})`}
    </div>
    <div class="truncate">{track.artist}</div>
  </div>
  {@render art()}
</div>
