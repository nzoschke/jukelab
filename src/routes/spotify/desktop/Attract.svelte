<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
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

  const defaultMessages = [
    "Welcome to JukeLab",
    "Press any key to continue",
    "Tap anywhere to start",
    "Select your favorite tunes",
  ];

  const holidayMessages = [
    "Happy Holidays!",
    "Tap anywhere for turkey",
    "Select your favorite holiday tunes",
  ];

  const messages = $derived($holiday ? holidayMessages : defaultMessages);
  let msgIdx = $state(0);
  const message = $derived(messages[msgIdx]);

  onMount(() => {
    if (!browser) {
      return;
    }

    const i = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
    }, 5000);

    return () => clearInterval(i);
  });

  const onClose = () => (visible = false);
</script>

{#if visible}
  <div
    role="button"
    aria-label="Close attract screen"
    tabindex="0"
    class="flex h-screen w-screen flex-col items-center justify-center"
    in:fade
    out:fade
    onclick={onClose}
    onkeydown={onClose}
  >
    <h1 class="absolute right-5 top-5 text-5xl text-neutral">
      Queue: {pad(playlist.queue.length)}
    </h1>

    {#if format === "default"}
      <Standard {playlist} {message} />
    {:else if format === "vinyl"}
      <Vinyl {playlist} {message} />
    {:else if format === "dvd"}
      <DVD {playlist} {message} />
    {/if}

    {#if $holiday}
      <Snow />
    {/if}

    <button
      class="btn btn-circle btn-neutral absolute bottom-5 right-5"
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
