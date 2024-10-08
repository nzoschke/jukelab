<script lang="ts">
  import type { Track } from "$lib/types/music";

  let {
    track,
  }: {
    track: Track;
  } = $props();
</script>

<div
  class="flex h-24 min-h-24 w-1/2 flex-col items-center justify-center rounded bg-base-200"
  class:skeleton={!track.src}
>
  <div>{track.title}</div>
  <div>{track.album} {track.year.getMilliseconds() == 0 ? "" : `(${track.year})`}</div>
  <div>{track.artist}</div>
</div>
