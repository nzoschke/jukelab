<script lang="ts">
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import { Audio } from "$lib/types/audio";
  import { onMount } from "svelte";
  import { Icon, Signal } from "svelte-hero-icons";

  const bc = Broadcast();

  let {
    audio = $bindable(Audio),
    channel,
    name,
    skip,
  }: {
    audio: Audio;
    channel: string;
    name: string;
    skip: (delta: number) => void;
  } = $props();

  onMount(() => {
    bc.sub(channel, name, (msg) => {
      if (msg.type == "skip") {
        skip(msg.payload.delta || 1);
      }
      if (msg.type == "pause") {
        audio.paused = msg.payload.paused;
      }
    });
  });

  $effect(() => {
    bc.pub(channel, { type: "pause", payload: { paused: audio.paused } });
  });
</script>

<div class="tooltip" data-tip={channel}>
  <button class="btn btn-circle btn-ghost" onclick={() => {}}>
    <Icon src={Signal} class="size-5" solid />
  </button>
</div>
