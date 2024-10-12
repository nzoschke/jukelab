<script lang="ts">
  import type { AlbumTracks } from "$lib/types/music";

  let {
    album,
  }: {
    album: AlbumTracks;
  } = $props();
</script>

{#each album.tracks as t}
  <div>{t.title}</div>
{/each}
