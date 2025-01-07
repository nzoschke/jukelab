<script lang="ts">
  import { Playlist } from "../playlist.svelte";
  import { fade } from "svelte/transition";
  import Standard from "./attract/Standard.svelte";
  import Vinyl from "./attract/Vinyl.svelte";
  import DVD from "./attract/DVD.svelte";
  import { pad } from "$lib/string";
  import { holiday } from "./store";
  import Snow from "$lib/shared/snow.svelte";
  import { Icon, ArrowPath } from "svelte-hero-icons";

  let {
    playlist,
    visible = $bindable(false),
  }: {
    playlist: ReturnType<typeof Playlist>;
    visible: boolean;
  } = $props();

  let format = $state("default");
  const onClose = () => (visible = false);
</script>

{#if visible}
  <div
    role="button"
    aria-label="Close attract screen"
    tabindex="0"
    class="flex h-screen w-screen flex-col items-center justify-center bg-slate-200"
    in:fade
    out:fade
    onclick={onClose}
    onkeydown={onClose}
  >
    <h1 class="absolute right-5 top-5 text-5xl text-base-300">
      Queue: {pad(playlist.queue.length)}
    </h1>

    {#if format === "default"}
      <Standard {playlist} />
    {:else if format === "vinyl"}
      <Vinyl {playlist} />
    {:else if format === "dvd"}
      <DVD {playlist} />
    {/if}

    {#if $holiday}
      <Snow />
    {/if}

    <button
      class="absolute bottom-5 right-5"
      onclick={(e) => {
        e.stopPropagation();
        if (format === "default") {
          format = "vinyl";
        } else if (format === "vinyl") {
          format = "dvd";
        } else {
          format = "default";
        }
      }}
    >
      <Icon src={ArrowPath} solid aria-label="Toggle Attract screen" role="img" class="h-5 w-5" />
    </button>
  </div>
{/if}
