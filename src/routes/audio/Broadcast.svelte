<script lang="ts">
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import { Audio } from "$lib/types/audio";
  import { onMount } from "svelte";
  import { Icon, Signal } from "svelte-hero-icons";
  import { Playlist } from "../spotify/playlist.svelte";

  const bc = Broadcast();

  let {
    audio = $bindable(Audio),
    channel,
    name,
    playlist,
  }: {
    audio: Audio;
    channel: string;
    name: string;
    playlist: ReturnType<typeof Playlist>;
  } = $props();

  onMount(() => {
    bc.sub(channel, name, (msg) => {
      if (msg.type == "skip") {
        playlist.skip(msg.payload.delta || 1);
      }
      if (msg.type == "pause") {
        audio.paused = msg.payload.paused;
      }
    });
  });

  $effect(() => {
    bc.pub(channel, { type: "pause", payload: { paused: audio.paused } });
  });

  $effect(() => {
    bc.pub(channel, { type: "art", payload: { art: playlist.album.art } });
    bc.pub(channel, { type: "track", payload: playlist.track });
  });
</script>

<div class="tooltip" data-tip={channel}>
  <button class="btn btn-circle btn-ghost" onclick={() => {}}>
    <Icon src={Signal} class="size-5" solid />
  </button>
</div>
