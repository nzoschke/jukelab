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
    <img alt="" class="h-full aspect-square" src={album.art} />
  {:else}
    <div class="h-full aspect-square"></div>
  {/if}
{/snippet}

<div
  class="flex h-24 min-h-24 w-1/2 items-center justify-center rounded bg-base-200 p-2 space-x-2"
  class:skeleton={!track.src}
>
  {@render art(album)}
  <div class="flex flex-col items-center text-center">
    <div>{track.title}</div>
    <div>{track.album} {track.year.getMilliseconds() == 0 ? "" : `(${track.year})`}</div>
    <div>{track.artist}</div>
  </div>
  {@render art()}
</div>
