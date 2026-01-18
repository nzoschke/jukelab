<script lang="ts">
  import { Auth } from "$lib/auth";
  import { Audio } from "$lib/types/audio";
  import { AlbumTracks } from "$lib/types/music";
  import { onMount } from "svelte";
  import { Bars3, Icon, Play, Plus, QueueList, Home, MusicalNote } from "svelte-hero-icons";
  import PlaySkip from "../../audio/PlaySkip.svelte";
  import AudioC from "../Audio.svelte";
  import Avatar from "../Avatar.svelte";
  import Menu from "../Menu.svelte";
  import Queue from "../Queue.svelte";
  import { Log } from "../log.svelte";
  import { AlbumTrack, Playlist } from "../playlist.svelte";
  import { Sleep } from "../Sleep.svelte";
  import PlayDialog from "../desktop/PlayDialog.svelte";
  import ThemeDialog from "../desktop/ThemeDialog.svelte";
  import { getTheme, theme } from "$lib/themes";
  import { anim, getAnimation } from "$lib/animations";
  import { browser } from "$app/environment";

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
    view: "albums" as "albums" | "tracks" | "queue",
    toast: false,
    toastImage: "",
    playDialog: false,
    theme: false,
  });

  const themeSpec = $derived(getTheme($theme));
  const themeStyle = $derived.by(() => {
    let bg: string[] = [];

    if (themeSpec.backgroundColor) {
      bg.push(`background-color: ${themeSpec.backgroundColor};`);
    }
    if (themeSpec.backgroundGradient) {
      bg.push(
        `background: url("https://assets.getpartiful.com/backgrounds/${$theme}/web.mp4"), ${themeSpec.backgroundGradient};`,
      );
    }
    return bg.join(" ");
  });
  const transparent = $derived(themeSpec.transparent);
  const animSpec = $derived(getAnimation($anim));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let LottiePlayer: any = $state();

  const onHandleDialogPlay = async (photo?: string) => {
    playlist.enqueue(select.track, photo);
    ui.toast = true;
    if (photo) {
      ui.toastImage = photo;
    } else {
      ui.toastImage = "";
    }
    setTimeout(() => {
      ui.toast = false;
    }, 3000);
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

  // if playing and sleep is uninitialized, disable sleep (enable wake lock)
  $effect(() => {
    if (!audio.paused && sleep.disabled === undefined) {
      sleep.disabled = true;
    }
  });

  onMount(async () => {
    await playlist.get(auth.token, (a) => {
      select.album = a;
    });
    select.album = playlist.albums[0];

    if (browser) {
      const module = await import("@lottiefiles/svelte-lottie-player");
      LottiePlayer = module.LottiePlayer;
    }
  });
</script>

<svelte:head>
  <title>Spotify Jukebox</title>
  <meta name="description" content="Spotify Jukebox" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  />
</svelte:head>

<!-- audio element -->
<AudioC bind:audio log={log.log} token={auth.token} src={playlist.track.src} />

<!-- theme backdrop -->
{#key themeStyle}
  <div class="backdrop {themeSpec.backdropClass}" style={themeStyle}>
    {#if themeSpec.animationStyle === "video"}
      <video autoplay playsinline loop muted>
        <source
          src="https://assets.getpartiful.com/backgrounds/{$theme}/web.mp4"
          type="video/mp4"
        />
      </video>
    {/if}
  </div>
{/key}

<!-- animation backdrop -->
{#key animSpec}
  <div class="backdrop">
    {#if animSpec.ext === "mp4"}
      <video autoplay playsinline loop muted>
        <source
          src="https://assets.getpartiful.com/animations/{$anim}/web.mov"
          type="video/mp4;codecs=hvc1"
        />
        <source
          src="https://assets.getpartiful.com/animations/{$anim}/web.webm"
          type="video/webm"
        />
      </video>
    {/if}
    {#if animSpec?.ext === "json" && LottiePlayer}
      <LottiePlayer
        src="https://assets.getpartiful.com/animations/{$anim}/web.json"
        autoplay
        loop
        renderer="svg"
        background="transparent"
        width="100vw"
        height="100vh"
      />
    {/if}
  </div>
{/key}

<!-- drawer for menu -->
<div class="drawer bg-transparent" data-theme={themeSpec.darkMode ? "dark" : "corporate"}>
  <input id="phone-drawer" type="checkbox" class="drawer-toggle" />

  <div
    class="drawer-content flex h-svh flex-col"
    class:bg-base-100={!transparent}
    class:bg-transparent={transparent}
  >
    <!-- top navbar -->
    {@render navbar()}

    <!-- main content area -->
    <div class="flex-1 overflow-hidden">
      {#if ui.view === "albums"}
        {@render albumsView()}
      {:else if ui.view === "tracks"}
        {@render tracksView()}
      {:else if ui.view === "queue"}
        {@render queueView()}
      {/if}
    </div>

    <!-- now playing bar -->
    {@render nowPlaying()}

    <!-- bottom navigation -->
    {@render bottomNav()}
  </div>

  <div class="drawer-side z-50">
    <label for="phone-drawer" aria-label="close menu" class="drawer-overlay"></label>
    <Menu {playlist} onThemeClick={() => (ui.theme = true)} />
  </div>

  <ThemeDialog bind:open={ui.theme} />
</div>

<!-- toast notification -->
<div class="toast toast-end toast-bottom z-50 mb-32" class:hidden={!ui.toast}>
  {#if ui.toastImage}
    <div class="avatar shadow-lg">
      <div class="w-24 rounded-lg">
        <img src={ui.toastImage} alt="" />
      </div>
    </div>
  {/if}
  <div role="alert" class="alert alert-success shadow-lg">
    <Icon src={Plus} class="size-5" />
    <div class="overflow-hidden">
      <span class="truncate text-sm font-bold">Added to queue</span>
    </div>
  </div>
</div>

<!-- play dialog -->
<PlayDialog bind:open={ui.playDialog} track={select.track} onPlay={onHandleDialogPlay} />

<!-- snippets -->
{#snippet navbar()}
  <div class="navbar min-h-14 bg-base-200 px-2" class:bg-opacity-40={transparent}>
    <div class="navbar-start">
      <label for="phone-drawer" class="btn btn-circle btn-ghost btn-sm">
        <Icon src={Bars3} class="size-5" />
      </label>
    </div>
    <div class="navbar-center">
      <span class="text-lg font-bold">Jukebox</span>
    </div>
    <div class="navbar-end">
      <Avatar path="/spotify/phone" />
    </div>
  </div>
{/snippet}

{#snippet albumsView()}
  <div class="h-full overflow-y-auto p-3">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {#each playlist.albums as album}
        <button
          class="card bg-base-200 shadow transition-transform active:scale-95"
          class:bg-opacity-40={transparent}
          onclick={() => {
            select.album = album;
            ui.view = "tracks";
          }}
        >
          <figure>
            <img class="aspect-square w-full object-cover" src={album.art} alt={album.title} />
          </figure>
          <div class="card-body p-2">
            <p class="truncate text-sm font-semibold">{album.title}</p>
            <p class="truncate text-xs opacity-70">{album.artist}</p>
          </div>
        </button>
      {/each}
    </div>
    {#if playlist.albums.length === 0}
      <div class="flex h-full items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet tracksView()}
  <div class="flex h-full justify-center">
    <div class="flex h-full w-full max-w-xl flex-col">
      <!-- album header -->
      <div class="flex items-center gap-3 bg-base-200 p-3" class:bg-opacity-40={transparent}>
        <button
          class="btn btn-circle btn-ghost btn-sm"
          onclick={() => {
            ui.view = "albums";
          }}
        >
          ←
        </button>
        <div class="avatar">
          <div class="w-14 rounded">
            <img src={select.album.art} alt={select.album.title} />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-bold">{select.album.title}</p>
          <p class="truncate text-sm opacity-70">{select.album.artist}</p>
        </div>
      </div>

      <!-- track list -->
      <div class="flex-1 overflow-y-auto">
        {#each select.album.tracks as track, n}
          <button
            class="flex w-full items-center gap-3 px-4 py-3 active:bg-base-200"
            onclick={() => {
              select.track = playlist.find({ albumSrc: select.album.src, trackSrc: track.src });
              ui.playDialog = true;
            }}
          >
            <div
              class="flex size-8 items-center justify-center rounded-full bg-primary text-primary-content"
            >
              <Icon src={Play} class="size-4" solid />
            </div>
            <span class="min-w-6 text-sm opacity-50">{n + 1}</span>
            <span class="flex-1 truncate text-left">{track.title}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/snippet}

{#snippet queueView()}
  <div class="flex h-full justify-center">
    <Queue {playlist} hidden={false} class="h-full w-full max-w-xl" />
  </div>
{/snippet}

{#snippet nowPlaying()}
  {@const { album, track } = playlist}

  <div
    class="flex shrink-0 items-center gap-2 bg-base-200 p-2"
    class:bg-opacity-40={transparent}
    class:hidden={!track.title}
  >
    <div class="avatar">
      <div class="w-12 rounded">
        {#if album.art}
          <img src={album.art} alt={album.title} />
        {/if}
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold">{track.title}</p>
      <p class="truncate text-xs opacity-70">{track.artist}</p>
      <progress
        class="progress progress-primary h-1 w-full"
        max={audio.duration}
        value={audio.currentTime}
      ></progress>
    </div>
    <div class="shrink-0">
      <PlaySkip bind:audio skip={playlist.skip} />
    </div>
  </div>
{/snippet}

{#snippet bottomNav()}
  <div
    class="bottom-nav flex shrink-0 border-t border-base-300 bg-base-200"
    class:bg-opacity-40={transparent}
  >
    <button
      class="flex flex-1 flex-col items-center justify-center py-2"
      class:text-primary={ui.view === "albums"}
      onclick={() => {
        ui.view = "albums";
      }}
    >
      <Icon src={Home} class="size-5" />
      <span class="text-xs">Albums</span>
    </button>
    <button
      class="flex flex-1 flex-col items-center justify-center py-2"
      class:text-primary={ui.view === "tracks"}
      onclick={() => {
        ui.view = "tracks";
      }}
    >
      <Icon src={MusicalNote} class="size-5" />
      <span class="text-xs">Tracks</span>
    </button>
    <button
      class="flex flex-1 flex-col items-center justify-center py-2"
      class:text-primary={ui.view === "queue"}
      onclick={() => {
        ui.view = "queue";
      }}
    >
      <div class="indicator">
        <span
          class="badge indicator-item badge-primary badge-xs"
          class:hidden={!playlist.queue.length}>{playlist.queue.length}</span
        >
        <Icon src={QueueList} class="size-5" />
      </div>
      <span class="text-xs">Queue</span>
    </button>
  </div>
{/snippet}

<style>
  :global(html) {
    overflow: hidden;
  }

  .bottom-nav {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .backdrop {
    box-sizing: border-box;
    background-repeat: repeat-y;
    background-size: 100% auto;
    left: 0;
    min-height: 100vh;
    overflow: hidden;
    pointer-events: none;
    position: fixed;
    top: 0;
    touch-action: none;
    width: 100vw;
  }
  .backdrop video {
    pointer-events: none;
    box-sizing: border-box;
    overflow: hidden;
    height: 100vh;
    left: 0;
    object-fit: cover;
    object-position: top;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 0;
  }
</style>
