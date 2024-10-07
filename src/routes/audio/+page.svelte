<script>
  import AudioC from "./Audio.svelte";
  import Controls from "./Controls.svelte";
  import { Audio } from "$lib/types/audio";

  let audio = $state(Audio);
</script>

<svelte:head>
  <title>Audio Controls</title>
  <meta name="description" content="Audio Controls" />
</svelte:head>

<AudioC bind:audio src="/steps.mp3" />

<div class="flex flex-col items-center space-y-2 p-2">
  <Controls bind:audio />
</div>
