<script lang="ts">
  import { Audio } from "$lib/types/audio";
  import Pos from "./Pos.svelte";
  import Vol from "./Vol.svelte";
  import Play from "./Play.svelte";

  let {
    audio = $bindable(Audio),
    class: cls = "",
  }: {
    audio: Audio;
    class?: string;
  } = $props();
</script>

<div class="flex w-full items-center space-x-12 {cls}">
  <Play bind:audio />
  <Pos bind:audio />
  <Vol bind:audio />
</div>
