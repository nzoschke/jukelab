<script lang="ts">
  import { API } from "$lib/spotify/api";
  import { Auth } from "$lib/spotify/auth";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import AudioC from "../Audio.svelte";
  import { Icon, Bars3, Bell, MagnifyingGlass } from "svelte-hero-icons";
  import Login from "../Login.svelte";

  const auth = Auth();

  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let albumPages = $derived(
    albums.reduce<AlbumTracks[][]>((all, one, i) => {
      const ch = Math.floor(i / 4);
      if (!all[ch]) all[ch] = [];
      all[ch].push(one);
      return all;
    }, []),
  );
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
        if (typeof v == "string" && re.test(v)) {
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

{#snippet alb(n: number, album?: AlbumTracks)}
  {#if album}
    <div class="h-1/2 flex">
      <div class="base-100 h-full w-0 flex-1">
        <div class="flex h-[2rem] md:h-[3rem]">TITLE</div>
        <div class="tracks h-full w-full text-base-content bg-amber-500">
          <div
            class="pointer-events-auto h-[calc(100%_-_2rem)] overflow-scroll text-xs md:h-[calc(100%_-_3rem)] md:text-base md:leading-[16px]"
          >
            {#each album.tracks as track, n}{/each}
          </div>
        </div>
      </div>
      <div class="border aspect-square h-full max-w-[50%] object-cover sm:max-w-full">IMG</div>
      <!-- <img class="aspect-square h-full max-w-[50%] object-cover sm:max-w-full" src={album.art} alt="" /> -->
    </div>
  {:else}
    <!-- <div class="border">JUKELAB</div> -->
  {/if}
{/snippet}

{#snippet nav()}
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <label for="drawer" class="btn btn-ghost btn-circle">
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
      <Login href="/spotify/jukebox" />
    </div>
  </div>
{/snippet}

{#snippet main()}
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
  <div>HI</div>
{/snippet}

{#snippet aside()}
  <div class="flex w-64 flex-col rounded-box border bg-red-200">
    <div role="tablist" class="tabs tabs-lifted">
      <button role="tab" class="tab">Tab 1</button>
      <button role="tab" class="tab" class:tab-active={true}>Tab 2</button>
      <button role="tab" class="tab">Tab 3</button>
    </div>
  </div>
{/snippet}

{#snippet footer()}
  <div class="navbar bg-base-100">
    <div class="navbar-start"></div>
    <div class="navbar-center"></div>
    <div class="navbar-end"></div>
  </div>
{/snippet}

{#snippet details()}
  <footer class="footer h-48 items-center bg-neutral p-4 text-neutral-content">
    <pre>console</pre>
  </footer>
{/snippet}

{#snippet menu()}
  <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
    <li>Sidebar Item 1</li>
    <li>Sidebar Item 2</li>
  </ul>
{/snippet}

<div class="drawer">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <div class="flex h-screen w-screen flex-col overflow-hidden">
      {@render nav()}

      <div class="flex flex-grow justify-end overflow-y-scroll">
        <div class="flex w-full flex-col overflow-scroll">
          {@render main()}
        </div>
        {@render aside()}
      </div>

      {@render footer()}
      {@render details()}
    </div>
  </div>
  <div class="drawer-side">
    <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    {@render menu()}
  </div>
</div>
