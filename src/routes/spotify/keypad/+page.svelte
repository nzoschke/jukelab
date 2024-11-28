<script lang="ts">
  import { Auth } from "$lib/auth";
  import { pad } from "$lib/string";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks } from "$lib/types/music";
  import { onMount } from "svelte";
  import { Bars3, ChevronLeft, ChevronRight, Icon, XMark } from "svelte-hero-icons";
  import AudioC from "../Audio.svelte";
  import Avatar from "../Avatar.svelte";
  import Menu from "../Menu.svelte";
  import { AlbumTrack, Playlist } from "../playlist.svelte";
  import Queue from "../Queue.svelte";
  import { Sleep } from "../Sleep.svelte";
  import { chunk } from "$lib/array";

  type Tabs = "queue" | "shuffle" | "history";

  const auth = Auth();
  const playlist = Playlist();
  const sleep = Sleep();

  let audio = $state(Audio);
  let num = $state("____");
  let numTimeout = setTimeout(() => {}, 0);
  let page = $state(0);
  const pages = $derived(playlist.albums.length / 4);
  let select = $state(AlbumTrack);
  let ui = $state({
    aside: false,
    details: false,
    party: false,
    physical: false,
    tab: "queue" as Tabs,
  });

  const pageScroll = (delta: number) => {
    page += delta;
    if (page < 0) page = 0;
    if (page >= pages) page = pages - 1;

    const el = document.getElementById("carousel") as HTMLDivElement;
    el.scrollLeft = page * (el.scrollWidth / pages);
  };

  const onchar = async (c: string) => {
    // reset partial selection after 15s
    clearTimeout(numTimeout);
    numTimeout = setTimeout(() => {
      num = "____";
    }, 15 * 1000);

    num = c == "x" ? "____" : num.replace("_", c);
    if (num == "XXXX" || num.indexOf("_") >= 0) return;

    // process 4 digits
    clearTimeout(numTimeout);
    setTimeout(() => {
      num = "____";
    }, 1000);

    // magic codes
    if (num == "9900") {
      ui.party = !ui.party;
      return;
    }

    // albums start at 00, tracks at 01
    const ai = parseInt(num.slice(0, 2));
    const ti = parseInt(num.slice(2, 4)) - 1;

    if (ti < 0) {
      num = "XXXX";
      return;
    }

    const album = playlist.albums.at(ai);
    if (!album) {
      num = "XXXX";
      return;
    }

    const track = album.tracks.at(ti);
    if (!track) {
      num = "XXXX";
      return;
    }

    select = playlist.find({ albumSrc: album.src, trackSrc: track.src });
    await playlist.enqueue(select);

    const el = document.getElementById("enqueue") as HTMLDialogElement;
    el.showModal();
    setTimeout(() => {
      el.close();
    }, 2500);
  };

  const onkeydown = (e: KeyboardEvent) => {
    if (e.metaKey) return;
    ui.physical = true;
    switch (e.key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        onchar(e.key);
        break;
      case "Backspace":
      case ".":
      case "x":
        onchar("x");
        break;
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
      case "a":
        playlist.skip(-1);
        break;
      case " ":
      case "s":
        audio.paused = !audio.paused;
        break;
      case "d":
        playlist.skip(+1);
        break;
    }
  };

  onMount(async () => {
    await playlist.get(auth.token);
  });

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
</script>

<svelte:window {onkeydown} />

<svelte:head>
  <title>CD-100 Jukebox</title>
  <meta name="description" content="CD-100 Jukebox" />
</svelte:head>

<!-- audio element -->
<AudioC bind:audio token={auth.token} src={playlist.track.src} />

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
  <div class="navbar min-h-20 bg-base-200 p-0">
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
    <label for="drawer" class="btn btn-circle btn-ghost" class:hidden={ui.party}>
      <Icon src={Bars3} class="size-5" />
    </label>
  {/snippet}

  {#snippet center()}
    <div class="flex w-full justify-between font-mono text-4xl">
      <p>SELECT {num}</p>
      <p>PLAYING {playlist.playing}</p>
      <button
        disabled={ui.party}
        onclick={() => {
          ui.aside = !ui.aside;
        }}>QUEUED {pad(playlist.queue.length)}</button
      >
    </div>
  {/snippet}

  {#snippet end()}
    <div class:hidden={ui.party}>
      <Avatar />
    </div>
  {/snippet}
{/snippet}

{#snippet main()}
  <div
    id="carousel"
    class="carousel size-full"
    onscrollend={({ currentTarget: t }) => {
      page = Math.round(t.scrollLeft / t.clientWidth);
    }}
  >
    {#each chunk(playlist.albums, 4) as albums, n}
      <div class="carousel-item size-full">
        <div class="carousel-item size-full">
          <div class="flex size-full flex-wrap">
            <div class="flex size-1/2 border-2">
              {@render album(n * 4 + 0, albums[0])}
            </div>
            <div class="flex size-1/2 flex-row-reverse border-2">
              {@render album(n * 4 + 2, albums[2])}
            </div>
            <div class="flex size-1/2 border-2">
              {@render album(n * 4 + 1, albums[1])}
            </div>
            <div class="flex size-1/2 flex-row-reverse border-2">
              {@render album(n * 4 + 3, albums[3])}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#snippet album(n: number, album: AlbumTracks)}
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
            <div class="w-full truncate">
              <span class="font-mono font-bold">{pad(n + 1)}</span>
              {track.title}
            </div>
          {/each}
        </div>
      </div>
      <img
        class="aspect-square max-w-[70%] object-cover object-center"
        src={album?.art}
        alt="art"
      />
    {/if}
  {/snippet}
{/snippet}

{#snippet aside()}
  <Queue {playlist} hidden={!ui.aside} />
{/snippet}

{#snippet footer()}
  <div
    class="join absolute bottom-1 flex w-full items-center justify-center"
    class:hidden={ui.physical}
  >
    <button
      class="btn btn-square join-item"
      onclick={() => {
        pageScroll(-1);
      }}
    >
      <Icon src={ChevronLeft} class="size-5" />
    </button>
    {#each Array(10) as _, i}
      <button
        class="btn btn-square join-item font-mono text-xl"
        onclick={() => {
          onchar(i.toString());
        }}>{i}</button
      >
    {/each}
    <button
      class="btn btn-square join-item"
      onclick={() => {
        onchar("x");
      }}
    >
      <Icon src={XMark} class="size-5" />
    </button>
    <button
      class="btn btn-square join-item"
      onclick={() => {
        pageScroll(+1);
      }}
    >
      <Icon src={ChevronRight} class="size-5" />
    </button>
  </div>
{/snippet}

{#snippet details()}
  <div class=""></div>
{/snippet}

<dialog id="enqueue" class="modal">
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">
      Queued {pad(select.albumNum)}{pad(select.trackNum + 1)}
    </h3>
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
