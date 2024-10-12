<script lang="ts">
  import { API } from "$lib/spotify/api";
  import { Auth } from "$lib/spotify/auth";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import {
    Bars3,
    Bell,
    CommandLine,
    Icon,
    MagnifyingGlass,
    ArrowLeftOnRectangle,
  } from "svelte-hero-icons";
  import PlaySkip from "../../audio/PlaySkip.svelte";
  import AudioC from "../Audio.svelte";
  import Login from "../Login.svelte";

  type Tabs = "queue" | "shuffle" | "history";

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
  let q = $state({
    queue: [] as Track[],
    shuffle: [] as Track[],
    history: [] as Track[],
  });

  let token = $state<string>();
  let track = $state(Track);
  let ui = $state({
    aside: false,
    details: false,
    queueTab: "queue" as Tabs,
  });

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

    q.queue = albums[0].tracks;
    q.shuffle = albums[1].tracks;
    q.history = albums[2].tracks;
  });
</script>

<svelte:head>
  <title>Spotify Jukebox</title>
  <meta name="description" content="Spotify Jukebox" />
</svelte:head>

<AudioC bind:audio src={track.src} />

<div class="drawer">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <div class="flex h-screen w-screen flex-col">
      {@render nav()}

      <div class="flex flex-grow justify-end overflow-scroll">
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
    <label for="drawer" aria-label="close menu" class="drawer-overlay"></label>
    {@render menu()}
  </div>
</div>

{#snippet menu()}
  <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
    <li>Sidebar Item 1</li>
    <li>Sidebar Item 2</li>
  </ul>
{/snippet}

{#snippet nav()}
  <div class="navbar h-16 bg-base-300">
    <div class="navbar-start">
      <label for="drawer" class="btn btn-circle btn-ghost">
        <Icon src={Bars3} class="size-5" />
      </label>
    </div>
    <div class="navbar-center flex h-12 w-1/2 rounded border border-gray-50 bg-base-200">
      <div class="size-10 pl-1">
        {#if album.art != ""}
          <img class="size-full" src={album.art} alt="" />
        {/if}
      </div>
      <div class="flex-1 text-center">
        <p class="truncate">{track.title}</p>
        <p class="truncate">
          {track.album}
          {track.year.getTime() == 0 ? "" : `(${track.year.getFullYear()})`}
        </p>
      </div>
    </div>
    <div class="navbar-end">
      <button class="btn btn-circle btn-ghost" aria-label="search">
        <Icon src={MagnifyingGlass} class="size-5" />
      </button>
      <button class="btn btn-circle btn-ghost" aria-label="notifications">
        <div class="indicator">
          <Icon src={Bell} class="size-5" />
          <span class="badge indicator-item badge-primary badge-xs"></span>
        </div>
      </button>
      <Login href="/spotify/jukebox" />
    </div>
  </div>
{/snippet}

{#snippet main()}
  <div class="carousel size-full">
    {#each albumPages as albums, n}
      <div class="carousel-item size-full">
        <div class="flex size-full flex-wrap">
          <div class="flex size-1/2 border-2">
            {@render _album(n * 4 + 0, albums[0])}
          </div>
          <div class="flex size-1/2 flex-row-reverse border-2">
            {@render _album(n * 4 + 2, albums[2])}
          </div>
          <div class="flex size-1/2 border-2">
            {@render _album(n * 4 + 1, albums[1])}
          </div>
          <div class="flex size-1/2 flex-row-reverse border-2">
            {@render _album(n * 4 + 3, albums[3])}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet aside()}
  <div class="flex w-64 flex-col bg-base-300" class:hidden={!ui.aside}>
    <div role="tablist" class="tabs-boxed tabs">
      {@render tab("queue")}
      {@render tab("shuffle")}
      {@render tab("history")}
    </div>
    {@render list("queue", q.queue)}
    {@render list("shuffle", q.shuffle)}
    {@render list("history", q.history)}
  </div>

  {#snippet tab(tab: Tabs)}
    <button
      role="tab"
      class="tab"
      class:tab-active={ui.queueTab == tab}
      onclick={() => {
        ui.queueTab = tab;
      }}>{tab.toUpperCase()}</button
    >
  {/snippet}

  {#snippet list(tab: Tabs, tracks: Track[])}
    {#each tracks as t}
      <div class="flex p-1" class:hidden={ui.queueTab != tab}>
        <!-- <img class="h-12 w-12" src={t.art} alt="art" /> -->
        <div class="flex flex-col truncate pl-2">
          <div>{t.title}</div>
          <div>{t.artist}</div>
        </div>
      </div>
    {/each}
  {/snippet}
{/snippet}

{#snippet footer()}
  <div class="navbar h-16 bg-base-300">
    <div class="navbar-start"></div>
    <div class="navbar-center">
      <PlaySkip bind:audio {skip} />
    </div>
    <div class="navbar-end">
      <button
        class="btn btn-circle btn-ghost"
        onclick={() => {
          ui.aside = !ui.aside;
        }}
      >
        <Icon src={ArrowLeftOnRectangle} class="size-5" solid={ui.aside} />
      </button>

      <button
        class="btn btn-circle btn-ghost"
        onclick={() => {
          ui.details = !ui.details;
        }}
      >
        <Icon src={CommandLine} class="size-5" solid={ui.details} />
      </button>
    </div>
  </div>
{/snippet}

{#snippet details()}
  <div
    class="flex h-24 min-h-24 flex-col-reverse overflow-scroll bg-base-content p-2 text-xs text-neutral-content"
    class:hidden={!ui.details}
  >
    <div class="">
      <pre data-prefix="$"><code>START</code></pre>
      <pre data-prefix="$"><code>npm i daisyui</code></pre>
      <pre data-prefix=">" class="text-warning"><code>installing...</code></pre>
      <pre data-prefix=">" class="text-success"><code>Done!</code></pre>
      <pre data-prefix="$"><code>npm i daisyui</code></pre>
      <pre data-prefix=">" class="text-warning"><code>installing...</code></pre>
      <pre data-prefix=">" class="text-success"><code>Done!</code></pre>
      <pre data-prefix=">" class="text-success"><code>END!</code></pre>
    </div>
  </div>
{/snippet}

{#snippet _album(n: number, album: AlbumTracks)}
  <div class="flex flex-1 flex-col overflow-hidden">
    <div class="flex">
      <div
        class="flex aspect-square size-12 items-center justify-center bg-black text-2xl font-bold text-white"
      >
        {n.toString().padStart(2, "0")}
      </div>
      <div class="flex flex-col overflow-hidden">
        <p class="truncate">{album.title}</p>
        <p class="truncate">{album.artist}</p>
      </div>
    </div>
    <div class="h-full w-full overflow-scroll">
      {#each album.tracks as track, n}
        <p class="truncate">
          <span class="font-mono font-bold">{(n + 1).toString().padStart(2, "0")}</span>
          {track.title}
        </p>
      {/each}
    </div>
  </div>
  <img class="aspect-square max-w-[70%] object-cover object-center" src={album?.art} alt="art" />
{/snippet}

<style>
  :global(html) {
    overflow: hidden;
  }
</style>
