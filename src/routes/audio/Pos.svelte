<script lang="ts">
  import { mmss } from "$lib/time";
  import { Audio } from "$lib/types/audio";

  let {
    audio = $bindable(Audio),
  }: {
    audio: Audio;
  } = $props();
</script>

<div class="flex flex-grow items-center space-x-2 font-mono">
  <div>{mmss(audio.currentTime)}</div>
  <input
    class="range flex-1"
    max={audio.duration}
    min="0"
    onchange={(e) => {
      audio.seeking = false;
      audio.currentTime = parseFloat(e.currentTarget.value);
    }}
    oninput={(e) => {
      audio.seeking = true;
      audio.currentTime = parseFloat(e.currentTarget.value);
    }}
    step="0.1"
    type="range"
    value={audio.currentTime}
  />
  <div>{mmss(audio.duration)}</div>
</div>
