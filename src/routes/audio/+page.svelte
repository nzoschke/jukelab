<script>
  import AudioC from "./Audio.svelte";
  import Controls from "./Controls.svelte";
  import { Audio } from "$lib/types/audio";
  import Header from "../Header.svelte";
  import { href } from "$lib/href";

  let audio = $state(Audio);
  let controls = $state(true);
</script>

<svelte:head>
  <title>HTML Audio</title>
  <meta name="description" content="HTML Audio" />
</svelte:head>

<div class="flex w-full flex-col items-center space-y-8">
  <Header />

  <div class="flex w-full max-w-2xl flex-col items-center space-y-8">
    <h1 class="text-5xl font-bold">HTML Audio</h1>

    <div class="prose">
      <p>
        JukeLab is built on <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio">HTML Audio</a
        >
        and <a href="https://learn.svelte.dev/tutorial/media-elements">Svelte Media Elements</a>.
        You can bind properties of an <span class="font-mono">&lt;audio&gt;</span> element to easily build
        a custom player UI.
      </p>

      <div class="form-control">
        <label class="label cursor-pointer justify-start space-x-2">
          <input type="checkbox" class="toggle" bind:checked={controls} />
          <span class="label-text">Toggle ugly browser audio controls</span>
        </label>
      </div>
    </div>

    <Controls bind:audio />

    <AudioC bind:audio src={href("/steps.mp3")} {controls} />
  </div>
</div>
