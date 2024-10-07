<script lang="ts">
  import { Icon, Pause, Play } from "svelte-hero-icons";
  import { Audio } from "$lib/types/audio";

  let {
    audio = $bindable(Audio),
    class: cls = "",
  }: {
    audio: Audio;
    class?: string;
  } = $props();
</script>

<button
  class="btn btn-circle btn-primary {cls}"
  class:btn-disabled={audio.readyState != 4}
  onclick={() => {
    audio.paused = !audio.paused;
  }}
  aria-label="playPause"
>
  {#if audio.paused}
    <Icon src={Play} solid class="size-6" aria-hidden="false" aria-label="play" role="img" />
  {:else}
    <Icon src={Pause} solid class="size-6" aria-hidden="false" aria-label="pause" role="img" />
  {/if}
</button>
