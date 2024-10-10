<script lang="ts">
  import { Audio } from "$lib/types/audio";
  import { Album, AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import PlaySkip from "../../audio/PlaySkip.svelte";
  import Pos from "../../audio/Pos.svelte";
  import Vol from "../../audio/Vol.svelte";
  import { API } from "../api";
  import AudioC from "../Audio.svelte";
  import { Auth } from "../auth";
  import Login from "../Login.svelte";
  import Title from "../Title.svelte";

  const auth = Auth();

  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let audio = $state(Audio);
  let src = "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E";
  let playlist = $state(PlaylistTracks);

  let token = $state<string>();
  let track = $state(Track);

  const skip = (delta: number) => {
    // const { tracks } = album;
    // let n = tracks.findIndex((t) => t.src == track.src) + delta;
    // if (n >= tracks.length) n = 0;
    // if (n < 0) n = tracks.length - 1;
    // track = tracks[n];
  };

  // when ended, play next by updating track.src
  $effect(() => {
    if (audio.ended) skip(1);
  });

  const _playlist = async () => {
    const api = API();
    playlist = await api.playlist(src);

    // get from cache if snapshot id matches
    const key = `${src}:${playlist.id}`;
    const i = localStorage.getItem(key);
    if (i) {
      var re = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
      albums = JSON.parse(i, (k, v) => {
        if (typeof v == "string" && re.exec(v)) {
          return new Date(v);
        }
        return v;
      });
      album = albums[0];
      track = album.tracks[0];

      return;
    }

    // clear cache for old snapshot id
    Object.keys(localStorage)
      .filter((k) => k.startsWith(`${src}:`))
      .forEach((k) => localStorage.removeItem(k));

    // fetch albums
    for (const [i, t] of playlist.tracks.entries()) {
      albums.push(await api.trackAlbum(t.src));
      if (i == 0) {
        album = albums[0];
        track = album.tracks[0];
      }
    }

    // set cache for snapshot id
    localStorage.setItem(key, JSON.stringify(albums));
  };

  onMount(async () => {
    token = await auth.token();
    if (!token) return;
    await _playlist();
  });
</script>

<svelte:head>
  <title>Spotify Jukebox</title>
  <meta name="description" content="Spotify Jukebox" />
</svelte:head>

<AudioC bind:audio src={track.src} />

<div class="flex h-[calc(100vh-10rem)] flex-col items-center space-y-2 p-2">
  <Title {album} {track} />

  <div class="w-full flex-grow overflow-scroll">
    {#each albums as a}
      {#each a.tracks as t}
        <div class:font-bold={t.src == track.src}>{t.title}</div>
      {/each}
    {/each}
  </div>

  <PlaySkip bind:audio {skip} />

  <div class="flex w-full items-center space-x-12">
    <Pos bind:audio />
    <Vol bind:audio />
  </div>

  <Login href="/spotify" />
</div>
