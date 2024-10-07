<script lang="ts">
  import { Audio } from "$lib/types/audio";

  let {
    audio = $bindable(Audio),
    class: cls = "",
    controls = false,
    loop = false,
    src = "",
  }: {
    audio?: Audio;
    class?: string;
    controls?: boolean;
    loop?: boolean;
    src: string;
  } = $props();

  // HACK: binding of `paused` is supposed to control playback
  $effect(() => {
    const el = document.getElementsByTagName("audio")[0];
    audio.paused ? el.pause() : el.play();
  });

  $effect(() => {
    audio.muted = audio.seeking;
  });
</script>

<audio
  class={cls}
  {controls}
  {loop}
  {src}
  bind:currentTime={audio.currentTime}
  bind:duration={audio.duration}
  bind:ended={audio.ended}
  bind:muted={audio.muted}
  bind:paused={audio.paused}
  bind:playbackRate={audio.playbackRate}
  bind:readyState={audio.readyState}
  bind:seeking={audio.seeking}
  bind:volume={audio.volume}
></audio>
