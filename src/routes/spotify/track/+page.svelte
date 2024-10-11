<script lang="ts">
  import { Audio } from "$lib/types/audio";
  import { Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import Controls from "../../audio/Controls.svelte";
  import { API } from "$lib/spotify/api";
  import AudioC from "../Audio.svelte";
  import { Auth } from "$lib/spotify/auth";
  import Title from "../Title.svelte";

  const auth = Auth();

  let audio = $state(Audio);
  let src = "spotify:track:0UK7txy2sUR6kqvEZtx72w";
  let token = $state<string>();
  let track = $state(Track);

  onMount(async () => {
    token = await auth.token();
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
