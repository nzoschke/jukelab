<script lang="ts">
  import { Auth } from "$lib/spotify/auth";
  import { pad } from "$lib/string";
  import { Audio } from "$lib/types/audio";
  import { Album, AlbumTracks } from "$lib/types/music";
  import { onMount } from "svelte";
  import { Bars3, CommandLine, Icon, QueueList, Sun, Play } from "svelte-hero-icons";
  import PlaySkip from "../../audio/PlaySkip.svelte";
  import AudioC from "../Audio.svelte";
  import Avatar from "../Avatar.svelte";
  import Menu from "../Menu.svelte";
  import Queue from "../Queue.svelte";
  import { Sleep } from "../Sleep.svelte";
  import { Log } from "../log.svelte";
  import { AlbumTrack, Playlist } from "../playlist.svelte";

  const auth = Auth();
  const log = Log();
  const sleep = Sleep();

  let audio = $state(Audio);
  let playlist = Playlist();
  let select = $state({
    album: AlbumTracks,
    track: AlbumTrack,
  });
  let ui = $state({
    aside: false,
    details: false,
  });

  let page = $state(0);
  const pages = $derived(playlist.albums.length / 4);
  const pageScroll = (delta: number) => {
    page += delta;
    if (page < 0) page = 0;
    if (page >= pages) page = pages - 1;

    const el = document.getElementById("carousel") as HTMLDivElement;
    el.scrollLeft = page * (el.scrollWidth / pages);
  };

  const onkeydown = (event: KeyboardEvent) => {
    if (event.metaKey) return;
    switch (event.key) {
      case "ArrowLeft":
      case "Enter":
      case "-":
      case "/":
        pageScroll(-1);
        break;
      case "ArrowRight":
      case "+":
      case "*":
        pageScroll(+1);
        break;
    }
  };

  // if queued when nothing is playing, play
  $effect(() => {
    if (
      audio.currentTime == 0 &&
      audio.paused &&
      playlist.queue.length == 1 &&
      playlist.history.length == 0
    ) {
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

  // if playing and sleep is unintialized, disable
  $effect(() => {
    if (!audio.paused && sleep.disabled === undefined) {
      sleep.disabled = true;
    }
  });

  onMount(async () => {
    await playlist.get(auth.token);
    select.album = playlist.albums[0];
  });
</script>

<svelte:window {onkeydown} />

<svelte:head>
  <title>Spotify Jukebox</title>
  <meta name="description" content="Spotify Jukebox" />
</svelte:head>

<!-- audio element -->
<AudioC bind:audio log={log.log} token={auth.token} src={playlist.track.src} />

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

<!-- page components -->
{#snippet menu()}
  <Menu {playlist} />
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
    <Avatar />
  {/snippet}
{/snippet}

{#snippet main()}
  <div class="flex h-full flex-col">
    <div
      id="carousel"
      class="carousel carousel-center w-full pb-1"
      onscrollend={({ currentTarget: t }) => {
        page = Math.round(t.scrollLeft / t.clientWidth);
      }}
    >
      {#each playlist.albums as album, n}
        <div class="carousel-item w-64">
          <button
            class="group w-full"
            onclick={() => {
              select.album = album;
            }}
            class:border-4={album == select.album}
          >
            <div class="card w-full rounded-sm bg-base-100 shadow">
              <figure class="relative size-full">
                <img class="aspect-square object-cover object-center" src={album?.art} alt="art" />
                <div
                  class="btn btn-circle btn-accent absolute bottom-0 right-0 m-2 hidden items-center group-hover:flex"
                >
                  <Icon src={Play} class="size-6" solid />
                </div>
              </figure>
              <div class="card-body w-full gap-0 p-2 text-left">
                <p class="truncate">{album.title}</p>
                <p class="truncate text-sm font-bold">{album.artist}</p>
              </div>
            </div>
          </button>
        </div>
      {/each}
    </div>
    <div class="flex-1 overflow-scroll">
      {#each select.album.tracks as track, n}
        <button
          class="group block w-full truncate text-left"
          onclick={() => {
            select.track = playlist.find({ albumSrc: select.album.src, trackSrc: track.src });
            const el = document.getElementById("select") as HTMLDialogElement;
            el.showModal();
          }}
        >
          <div class="flex group-hover:bg-base-300">
            <div class="relative flex size-12 items-center justify-center">
              <span class="absolute font-mono font-bold group-hover:hidden">{pad(n + 1)}</span>
              <div class="btn btn-square btn-ghost absolute hidden group-hover:flex">
                <Icon src={Play} class="size-6" solid />
              </div>
            </div>
            <div class="flex flex-col">
              <div>{track.title}</div>
              <div class="text-sm font-bold">{track.artist}</div>
            </div>
          </div>
          <!-- <div class="truncate group-hover:bg-base-300">
            <span class="font-mono font-bold">{pad(n + 1)}</span>
            {track.title}
          </div> -->
        </button>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet aside()}
  <Queue {playlist} hidden={!ui.aside} />
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
        sleep.disabled = !sleep.disabled;
      }}
    >
      <Icon src={Sun} class="size-5" solid={sleep.disabled} />
    </button>

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

<dialog id="select" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queue</h3>
    <p class="text-lg font-bold">{select.track.track.title}</p>
    <p>{select.track.track.artist}</p>
    <form method="dialog">
      <div class="modal-action justify-between">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <button
          class="btn btn-accent"
          onclick={async () => {
            playlist.enqueue(select.track);

            const el = document.getElementById("enqueue") as HTMLDialogElement;
            el.showModal();
            setTimeout(() => {
              el.close();
            }, 2500);
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
    <h3 class="pb-4 text-lg font-bold">Queued</h3>
    <p class="text-lg font-bold">{select.track.track.title}</p>
    <p>{select.track.track.artist}</p>
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
