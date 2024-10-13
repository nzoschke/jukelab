<script>
  import AudioC from "./Audio.svelte";
  import Controls from "./Controls.svelte";
  import { Audio } from "$lib/types/audio";
  import Header from "../Header.svelte";

  let audio = $state(Audio);
</script>

<svelte:head>
  <title>HTML Audio</title>
  <meta name="description" content="HTML Audio" />
</svelte:head>

<div class="flex flex-col items-center">
  <Header />

  <h1 class="py-16 text-5xl font-bold">HTML Audio</h1>

  <div class="prose">
    <p>
      JukeLab is built on <a href="https://learn.svelte.dev/tutorial/media-elements"
        >Svelte Media Elements</a
      >. You can bind properties of <span class="font-mono">&lt;audio&gt;</span> elements, making it
      easy to build customer player UI.
    </p>
  </div>

  <div class="w-1/2 py-16">
    <AudioC bind:audio src="/steps.mp3" />
    <Controls bind:audio />
  </div>
</div>
