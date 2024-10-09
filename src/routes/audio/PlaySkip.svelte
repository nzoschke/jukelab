<script lang="ts">
  import { Icon, Backward, Forward } from "svelte-hero-icons";
  import { Audio } from "$lib/types/audio";
  import Play from "./Play.svelte";

  let {
    audio = $bindable(Audio),
    skip,
  }: {
    audio: Audio;
    skip: (delta: number) => void;
  } = $props();
</script>

<div class="flex items-center">
  <button
    class="btn btn-circle btn-md"
    onclick={() => {
      skip(-1);
    }}
  >
    <Icon
      src={Backward}
      solid
      class="size-6"
      aria-hidden="false"
      aria-label="previous"
      role="img"
    />
  </button>

  <Play bind:audio class="btn-lg" />

  <button
    class="btn btn-circle"
    onclick={() => {
      skip(+1);
    }}
  >
    <Icon src={Forward} solid class="size-6" aria-hidden="false" aria-label="next" role="img" />
  </button>
</div>
