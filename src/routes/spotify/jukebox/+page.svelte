<script lang="ts">
  import { href } from "$lib/href";
  import { Auth } from "$lib/spotify/auth";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks } from "$lib/types/music";
  import type { UserProfile } from "@spotify/web-api-ts-sdk";
  import { onMount } from "svelte";
  import { Bars3, CommandLine, Icon, QueueList } from "svelte-hero-icons";
  import PlaySkip from "../../audio/PlaySkip.svelte";
  import AudioC from "../Audio.svelte";
  import { Log } from "./log.svelte";
  import { AlbumTrack, Playlist, type Src } from "./playlist.svelte";

  type Tabs = "queue" | "shuffle" | "history";

  const auth = Auth();
  const log = Log();

  let audio = $state(Audio);
  let playlist = Playlist("spotify:playlist:0JOnan9Ym7vJ485NEfdu5E");
  let profile = $state<UserProfile>();
  let token = $state<string>();
  let select = $state(AlbumTrack);

  let ui = $state({
    aside: false,
    details: false,
    tab: "queue" as Tabs,
  });

  const enqueue = async (at: AlbumTrack) => {
    await playlist.enqueue(at);

    const el = document.getElementById("enqueue") as HTMLDialogElement;
    el.showModal();
    setTimeout(() => {
      el.close();
    }, 2500);
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  // if queued when nothing is playing, play
  $effect(() => {
    if (audio.currentTime == 0 && audio.paused && playlist.queue.length == 1) {
      playlist.skip(1);
      audio.paused = false;
    }
  });

  // if playing with nothing queued, dequeue
  $effect(() => {
    if (!audio.paused && playlist.queue.length == 0 && playlist.history.length == 0) {
      playlist.skip(1);
    }
  });

  // if ended, play next
  $effect(() => {
    if (audio.ended) playlist.skip(1);
  });

  onMount(async () => {
    token = await auth.token();
    if (!token) {
      const res = await fetch(href("/playlist.json"));
      playlist.parse(await res.text());
      return;
    }

    profile = await auth.profile();
    await playlist.get(auth.token);
  });
</script>

<svelte:head>
  <title>Spotify Jukebox</title>
  <meta name="description" content="Spotify Jukebox" />
</svelte:head>

<!-- page layout -->
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

<!-- audio element -->
<AudioC bind:audio log={log.log} token={auth.token} src={playlist.track.src} />

<!-- page components -->
{#snippet menu()}
  <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
    <li><a href={href("/")}>Home</a></li>
    <li><a href="https://github.com/nzoschke/jukelab">GitHub</a></li>
  </ul>
{/snippet}

{#snippet nav()}
  <!-- component layout -->
  <div class="navbar min-h-20 bg-base-100 p-0">
    <div class="navbar-start w-32 p-2">
      {@render start()}
    </div>
    <div class="navbar-center flex grow justify-center">
      {@render center()}
    </div>
    <div class="navbar-end w-32 p-2">
      {@render end()}
    </div>
  </div>

  <!-- section layouts -->
  {#snippet start()}
    <label for="drawer" class="btn btn-circle btn-ghost">
      <Icon src={Bars3} class="size-5" />
    </label>
  {/snippet}

  {#snippet center()}
    {@const { album, track } = playlist}

    <div class="flex size-full space-x-2 rounded border bg-base-200 md:w-[32rem]">
      <div class="avatar size-16">
        <div class="rounded">
          {#if album.art != ""}
            <img class="size-full" src={album.art} alt="" />
          {/if}
        </div>
      </div>
      <div class="flex grow flex-col items-center justify-center overflow-hidden">
        <div class="w-full overflow-hidden text-center">
          <p class="truncate">{track.title}</p>
          <p class="truncate">
            {track.album}
            {track.year.getTime() == 0 ? "" : `(${track.year.getFullYear()})`}
          </p>
        </div>
      </div>
      <div class="size-16 min-w-16"></div>
    </div>
  {/snippet}

  {#snippet end()}
    {#if profile}
      <div class="group relative flex">
        <button
          class="avatar size-12 group-hover:opacity-0"
          onclick={async () => {
            auth.logout();
          }}
        >
          <div class="rounded-full">
            <img alt="" src={profile.images[0].url} />
          </div>
        </button>
        <button
          class="btn btn-circle btn-ghost absolute opacity-0 group-hover:opacity-100"
          onclick={async () => {
            auth.logout();
          }}
        >
          Logout
        </button>
      </div>
    {:else}
      <button
        class="btn btn-circle btn-ghost"
        class:hidden={token != ""}
        onclick={async () => {
          await auth.login("/spotify/jukebox");
        }}
      >
        Login
      </button>
    {/if}
  {/snippet}
{/snippet}

{#snippet main()}
  <div class="carousel size-full">
    <div class="skeleton size-full rounded-none" class:hidden={playlist.albums.length > 0}></div>

    {#each playlist.chunk(4) as albums, n}
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
  {@const { queue, shuffle, history } = playlist}

  <div class="flex w-80 flex-col overflow-hidden bg-base-300 p-1" class:hidden={!ui.aside}>
    <div role="tablist" class="tabs-boxed tabs">
      {@render tab("queue")}
      {@render tab("shuffle")}
      {@render tab("history")}
    </div>
    <div class="overflow-scroll">
      {@render list("queue", queue)}
      {@render list("shuffle", shuffle.slice(0, 20))}
      {@render list("history", history)}
    </div>
  </div>

  {#snippet tab(tab: Tabs)}
    <button
      role="tab"
      class="tab w-20"
      class:tab-active={ui.tab == tab}
      onclick={() => {
        ui.tab = tab;
      }}>{tab.toUpperCase()}</button
    >
  {/snippet}

  {#snippet list(tab: Tabs, srcs: Src[])}
    {#each srcs as src}
      {@const { album, track } = playlist.find(src)}
      <div class="flex items-center space-x-1 pt-1" class:hidden={ui.tab != tab}>
        <img class="h-12 w-12" src={album.art} alt="art" />
        <div class="flex flex-col overflow-hidden">
          <div class="truncate font-bold">{track.title}</div>
          <div class="truncate">{track.artist}</div>
        </div>
      </div>
    {/each}
  {/snippet}
{/snippet}

{#snippet footer()}
  {@const { progress } = playlist}

  <!-- component layout -->
  <div class="navbar relative min-h-20 bg-base-100 p-0">
    <progress
      class="progress progress-primary absolute -top-1 h-1"
      max={progress.max}
      value={progress.value}
      class:hidden={progress.value == progress.max}
    ></progress>

    <div class="navbar-start w-32 p-2">
      {@render start()}
    </div>
    <div class="navbar-center flex grow justify-center">
      {@render center()}
    </div>
    <div class="navbar-end w-32 p-2">
      {@render end()}
    </div>
  </div>

  {#snippet start()}
    <button
      class="btn btn-circle btn-ghost"
      onclick={() => {
        ui.details = !ui.details;
      }}
    >
      <Icon src={CommandLine} class="size-5" solid={ui.details} />
    </button>
  {/snippet}

  {#snippet center()}
    <PlaySkip bind:audio skip={playlist.skip} />
  {/snippet}

  {#snippet end()}
    <div class="indicator">
      <span
        class="badge indicator-item badge-neutral badge-sm mr-2 mt-2"
        class:hidden={!playlist.queue.length}>{playlist.queue.length}</span
      >
      <button
        class="btn btn-circle btn-ghost"
        onclick={() => {
          ui.aside = !ui.aside;
        }}
      >
        <Icon src={QueueList} class="size-5" solid={ui.aside} />
      </button>
    </div>
  {/snippet}
{/snippet}

{#snippet details()}
  <div
    class="flex h-24 min-h-24 flex-col-reverse overflow-scroll bg-black p-2 text-xs text-neutral-content"
    class:hidden={!ui.details}
  >
    <div>
      {#each log.logs as l}
        <pre data-prefix=">" class={`text-${l.level}`}><code>{l.msg}</code></pre>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet _album(n: number, album: AlbumTracks)}
  {#if !album}
    <!-- TODO: JukeLab placeholder -->
  {:else}
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex">
        <div
          class="flex aspect-square size-12 items-center justify-center bg-black text-2xl font-bold text-white"
        >
          {pad(n)}
        </div>
        <div class="ml-1 flex flex-col overflow-hidden">
          <p class="truncate font-bold">{album.title}</p>
          <p class="truncate">{album.artist}</p>
        </div>
      </div>
      <div class="ml-1 overflow-scroll">
        {#each album.tracks as track, n}
          <button
            class="block w-full truncate text-left"
            onclick={() => {
              select = playlist.find({ albumSrc: album.src, trackSrc: track.src });
              const el = document.getElementById("select") as HTMLDialogElement;
              el.showModal();
            }}
          >
            <span class="font-mono font-bold">{pad(n + 1)}</span>
            {track.title}
          </button>
        {/each}
      </div>
    </div>
    <img class="aspect-square max-w-[70%] object-cover object-center" src={album?.art} alt="art" />
  {/if}
{/snippet}

<dialog id="select" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queue {pad(select.albumNum)}{pad(select.trackNum + 1)}</h3>
    <p class="text-lg font-bold">{select.track.title}</p>
    <p>{select.track.artist}</p>
    <form method="dialog">
      <div class="modal-action justify-between">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <button
          class="btn btn-accent"
          onclick={async () => {
            await enqueue(select);
          }}>OK</button
        >
        <button class="btn btn-primary" onclick={() => {}}>NO</button>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="enqueue" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queued {pad(select.albumNum)}{pad(select.trackNum + 1)}</h3>
    <p class="text-lg font-bold">{select.track.title}</p>
    <p>{select.track.artist}</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<!-- page style -->
<style>
  :global(html) {
    overflow: hidden;
  }
</style>
