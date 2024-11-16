<script lang="ts">
  import { Auth, IUser } from "$lib/auth";
  import { pad } from "$lib/string";
  import { mmss } from "$lib/time";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks } from "$lib/types/music";
  import { onMount } from "svelte";
  import {
    Bars3,
    Clock,
    CommandLine,
    Icon,
    Play,
    Plus,
    QueueList,
    Sun,
    ChevronLeft,
    ChevronRight,
  } from "svelte-hero-icons";
  import Broadcast from "../../audio/Broadcast.svelte";
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
    toast: false,
  });
  let user = $state(IUser);

  let page = $state(0);
  let pages = $state(1);

  const pageJump = (n: number) => {
    pageScroll(n - page);
  };

  const pageScroll = (delta: number) => {
    const el = document.getElementById("carousel") as HTMLDivElement;
    pages = Math.round(el.scrollWidth / el.clientWidth);

    page += delta;
    if (page < 0) page = 0;
    if (page >= pages) page = pages - 1;

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
    user = await auth.user();
    await playlist.get(auth.token, (a) => {
      select.album = a;
    });
    select.album = playlist.albums[0];
    pageScroll(0);
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
<div class="drawer" data-theme="corporate">
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

    <div class="relative">
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
      <progress
        class="progress progress-primary absolute bottom-0 h-1"
        max={audio.duration}
        value={audio.currentTime}
      ></progress>
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
      class="carousel carousel-center relative w-full pb-1"
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
    <div class="flex h-10 items-center justify-center space-x-1">
      <button class="btn join-item btn-xs" onclick={() => pageScroll(-1)}>
        <Icon src={ChevronLeft} class="size-4" solid />
      </button>
      {#each Array(pages) as _, n}
        <button
          aria-label="page"
          class="badge badge-xs rounded-full"
          class:badge-neutral={n == page}
          onclick={() => pageJump(n)}
        ></button>
      {/each}
      <button class="btn join-item btn-xs" onclick={() => pageScroll(+1)}>
        <Icon src={ChevronRight} class="size-4" solid />
      </button>
    </div>
    <div class="flex-1 overflow-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album</th>
            <th><Icon src={Clock} class="size-4" /></th>
          </tr>
        </thead>
        <tbody>
          {#each select.album.tracks as track, n}
            <tr
              class="group hover cursor-pointer"
              onclick={() => {
                select.track = playlist.find({ albumSrc: select.album.src, trackSrc: track.src });
                const el = document.getElementById("select") as HTMLDialogElement;
                el.showModal();
              }}
            >
              <th class="w-12">
                <div class="group-hover:hidden">{pad(n + 1)}</div>
                <div class="hidden group-hover:block">
                  <Icon src={Play} class="size-4" solid />
                </div>
              </th>
              <td class="min-w-24 max-w-24">
                <div class="truncate">{track.title}</div>
                <div class="truncate text-sm font-bold">{track.artist}</div>
              </td>
              <td class="min-w-24 max-w-24">
                <div class="truncate">{select.album.title}</div>
              </td>
              <td class="w-12">{mmss(track.length / 1000)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
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

    {#if user.channel}
      <Broadcast bind:audio channel={user.channel} name="player" {playlist} />
    {/if}
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

<div class="toast z-10" class:hidden={!ui.toast}>
  <div role="alert" class="alert shadow-lg">
    <Icon src={Plus} class="size-5" />
    <div class="w-72 overflow-hidden">
      <h3 class="truncate font-bold">{select.track.track.title}</h3>
      <div class="truncate text-xs">{select.track.track.artist}</div>
    </div>
  </div>
</div>

<dialog id="select" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queue</h3>
    <p class="text-lg font-bold">{select.track.track.title}</p>
    <p>{select.track.track.artist}</p>
    <form method="dialog">
      <div class="modal-action justify-between">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <button class="btn" onclick={() => {}}>NO</button>
        <button
          class="btn btn-accent"
          onclick={async () => {
            playlist.enqueue(select.track);

            ui.toast = true;
            setTimeout(() => {
              ui.toast = false;
            }, 2000);
          }}>OK</button
        >
      </div>
    </form>
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
