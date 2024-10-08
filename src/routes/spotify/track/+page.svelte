<script lang="ts">
  import { Audio } from "$lib/types/audio";
  import { Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import Controls from "../../audio/Controls.svelte";
  import { API, token as _token } from "../api";
  import AudioC from "../Audio.svelte";
  import Title from "../Title.svelte";

  let audio = $state(Audio);
  let src = "spotify:track:0UK7txy2sUR6kqvEZtx72w";
  let token = $state<string>();
  let track = $state(Track);

  onMount(async () => {
    token = await _token();
    if (token == "") return;

    const api = API();
    track = await api.track(src);
  });
</script>

<svelte:head>
  <title>Spotify Track</title>
  <meta name="description" content="Spotify Track" />
</svelte:head>

<AudioC bind:audio {src} />

<div class="flex flex-col items-center space-y-2 p-2">
  <Title {track} />
  <Controls bind:audio />
</div>
