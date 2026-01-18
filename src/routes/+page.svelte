<script>
  import Controls from "./audio/Controls.svelte";
  import AudioC from "./audio/Audio.svelte";
  import { Audio } from "$lib/types/audio";
  import Header from "./Header.svelte";
  import { href } from "$lib/href";

  let audio = $state(Audio);
</script>

<svelte:head>
  <title>JukeLab Playground</title>
  <meta name="description" content="JukeLab Playground" />
</svelte:head>

<div class="flex min-h-svh flex-col">
  <Header />
  <div class="flex flex-1 flex-col items-center justify-center px-4 py-8">
    <h1 class="text-center text-3xl font-bold sm:text-4xl md:text-5xl">Welcome to JukeLab</h1>
    <p class="mt-4 text-center text-base-content/70">Your new music laboratory.</p>
    <div class="mt-8 w-full max-w-md">
      <AudioC bind:audio src={href("/steps.mp3")} />
      <Controls bind:audio />
    </div>
  </div>
</div>
