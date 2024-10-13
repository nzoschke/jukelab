<script lang="ts">
  import { Audio } from "$lib/types/audio";
  import { Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import Controls from "../audio/Controls.svelte";
  import { API } from "$lib/spotify/api";
  import AudioC from "./Audio.svelte";
  import { Auth } from "$lib/spotify/auth";
  import Title from "./Title.svelte";
  import Login from "./Login.svelte";

  import Header from "../Header.svelte";

  const auth = Auth();
  let src = "spotify:track:0UK7txy2sUR6kqvEZtx72w";
  let token = $state<string>();
  let track = $state(Track);

  let audio = $state(Audio);

  onMount(async () => {
    token = await auth.token();
    if (token == "") return;

    const api = API();
    track = await api.track(src);
  });
</script>

<svelte:head>
  <title>Spotify</title>
  <meta name="description" content="Spotify" />
</svelte:head>

<div class="flex flex-col items-center">
  <Header />

  <h1 class="py-16 text-5xl font-bold">Spotify</h1>

  <div class="prose">
    <p>
      JukeLab is built on <a href="https://developer.spotify.com/documentation/web-playback-sdk"
        >Spotify Web Playback SDK</a
      >. You can bind properties of a
      <a href="https://developer.spotify.com/documentation/web-playback-sdk/reference#spotifyplayer"
        >Spotify Player</a
      > component, making it easy to build customer player UI.
    </p>
    <p>Note that this requires logging into Spotify Premium and an access token.</p>
  </div>

  <div class="w-1/2 py-16">
    <AudioC bind:audio {src} />
    <Controls bind:audio />
  </div>
  <Login href="/spotify" />
</div>
