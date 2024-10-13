<script lang="ts">
  import { API } from "$lib/spotify/api";
  import { Auth } from "$lib/spotify/auth";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks, Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import PlaySkip from "../../audio/PlaySkip.svelte";
  import Pos from "../../audio/Pos.svelte";
  import Vol from "../../audio/Vol.svelte";
  import AudioC from "../Audio.svelte";
  import Login from "../Login.svelte";
  import Title from "../Title.svelte";

  const auth = Auth();

  let album = $state(AlbumTracks);
  let audio = $state(Audio);
  let src = "spotify:album:1iVsD8ZLyrdmTJBinwqq5j";
  let token = $state<string>();
  let track = $state(Track);

  const skip = (delta: number) => {
    const { tracks } = album;

    let n = tracks.findIndex((t) => t.src == track.src) + delta;
    if (n >= tracks.length) n = 0;
    if (n < 0) n = tracks.length - 1;

    track = tracks[n];
  };

  // when ended, play next by updating track.src
  $effect(() => {
    if (audio.ended) skip(1);
  });

  onMount(async () => {
    token = await auth.token();
    if (!token) return;

    const api = API();
    album = await api.albumTracks(src);
    track = album.tracks[0];
  });
</script>

<svelte:head>
  <title>Spotify Album</title>
  <meta name="description" content="Spotify Album" />
</svelte:head>

<AudioC bind:audio src={track.src} />

<div class="flex h-[calc(100vh-10rem)] flex-col items-center space-y-2 p-2">
  <Title {album} {track} />

  <div class="w-full flex-grow overflow-scroll">
    {#each album.tracks as t}
      <div class:font-bold={t.src == track.src}>{t.title}</div>
    {/each}
  </div>

  <PlaySkip bind:audio {skip} />

  <div class="flex w-full items-center space-x-12">
    <Pos bind:audio />
    <Vol bind:audio />
  </div>

  <Login href="/spotify" />
</div>
