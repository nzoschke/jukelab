<script lang="ts">
  import { API } from "$lib/spotify/api";
  import { Auth } from "$lib/spotify/auth";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import AudioC from "../Audio.svelte";
  import { Icon, Bars3, Bell, MagnifyingGlass } from "svelte-hero-icons";

  const auth = Auth();

  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let audio = $state(Audio);
  let src = "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E";
  let playlist = $state(PlaylistTracks);

  let token = $state<string>();
  let track = $state(Track);

  const skip = (delta: number) => {
    const tracks = albums.map((a) => a.tracks).flat();
    let n = tracks.findIndex((t) => t.src == track.src) + delta;
    if (n >= tracks.length) n = 0;
    if (n < 0) n = tracks.length - 1;
    track = tracks[n];
    album = albums.find((a) => a.tracks.includes(track))!;
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

<div class="w-svw h-svh bg-red-200">
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <div class="navbar bg-base-100">
        <div class="navbar-start">
          <label for="my-drawer" class="btn btn-ghost btn-circle">
            <Icon src={Bars3} class="size-5" />
          </label>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost text-xl" href="#top">JukeLab</a>
        </div>
        <div class="navbar-end">
          <button class="btn btn-ghost btn-circle" aria-label="search">
            <Icon src={MagnifyingGlass} class="size-5" />
          </button>
          <button class="btn btn-ghost btn-circle" aria-label="notifications">
            <div class="indicator">
              <Icon src={Bell} class="size-5" />
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>
</div>
