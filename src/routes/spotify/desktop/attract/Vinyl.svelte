<script lang="ts">
  import { Playlist } from "../../playlist.svelte";

  let { playlist }: { playlist: ReturnType<typeof Playlist> } = $props();
</script>

<div class="flex h-screen w-screen items-center justify-center bg-gray-300">
  <h1 class="text-4xl">Stuby vinyl attract screen</h1>
  {playlist.albums.length}
</div>
