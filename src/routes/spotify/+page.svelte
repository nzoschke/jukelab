<script>
  import AudioC from "./Audio.svelte";
  import Controls from "../audio/Controls.svelte";
  import { Audio } from "$lib/types/audio";

  let audio = $state(Audio);
</script>

<svelte:head>
  <title>Spotify Controls</title>
  <meta name="description" content="Spotify Controls" />
</svelte:head>

<AudioC bind:audio src="spotify:track:0UK7txy2sUR6kqvEZtx72w" />

<div class="flex flex-col items-center space-y-2 p-2">
  <Controls bind:audio />
</div>
