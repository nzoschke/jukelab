<script lang="ts">
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import { Audio } from "$lib/types/audio";
  import { onMount } from "svelte";
  import { Icon, Signal } from "svelte-hero-icons";
  import { Playlist } from "../spotify/playlist.svelte";

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

  const bc = Broadcast();
  let remote = $derived(bc.presence.values().find((v) => v.name == "remote"));

  const pub = () => {
    bc.pub(channel, { type: "art", payload: { art: playlist.album.art } });
    bc.pub(channel, { type: "pause", payload: { paused: audio.paused } });
    bc.pub(channel, { type: "track", payload: playlist.track });
  };

  onMount(() => {
    bc.sub(
      channel,
      name,
      (msg) => {
        if (msg.type == "skip") {
          playlist.skip(msg.payload.delta || 1);
        }
        if (msg.type == "pause") {
          audio.paused = msg.payload.paused;
        }
      },
      (p) => {
        if (p.name == "remote") pub();
      },
    );
  });

  $effect(() => {
    pub();
  });
</script>

<div class="tooltip" data-tip={channel} class:hidden={!remote}>
  <button class="btn btn-circle btn-ghost" onclick={() => {}}>
    <Icon src={Signal} class="size-5" solid />
  </button>
</div>
