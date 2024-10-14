<script>
  import Controls from "./audio/Controls.svelte";
  import AudioC from "./audio/Audio.svelte";
  import { Audio } from "$lib/types/audio";
  import Header from "./Header.svelte";
  import { href } from "$lib/href";

  let audio = $state(Audio);
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="JukeLab" />
</svelte:head>

<div class="flex flex-col items-center">
  <Header />
  <h1 class="py-16 text-5xl font-bold">Welcome to JukeLab</h1>
  <p>Your new music laboratory.</p>
  <div class="w-1/2 py-16">
    <AudioC bind:audio src={href("/steps.mp3")} />
    <Controls bind:audio />
  </div>
</div>
