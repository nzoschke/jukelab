<script lang="ts">
  import { Icon, SpeakerXMark, SpeakerWave } from "svelte-hero-icons";
  import { Audio } from "$lib/types/audio";

  let {
    audio = $bindable(Audio),
  }: {
    audio: Audio;
  } = $props();
</script>

<div class="flex items-center">
  <button
    class="btn btn-circle btn-xs"
    onclick={() => {
      audio.muted = !audio.muted;
    }}
  >
    {#if audio.muted}
      <Icon
        src={SpeakerXMark}
        solid
        class="size-6"
        aria-hidden="false"
        aria-label="unmute"
        role="img"
      />
    {:else}
      <Icon
        src={SpeakerWave}
        solid
        class="size-6"
        aria-hidden="false"
        aria-label="mute"
        role="img"
      />
    {/if}
  </button>

  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    bind:value={audio.volume}
    class="range range-xs w-32"
  />
</div>
