<script lang="ts">
  import { href } from "$lib/href";
  import { Playlist } from "./playlist.svelte";

  let {
    playlist,
  }: {
    playlist: ReturnType<typeof Playlist>;
  } = $props();

  let playlistIn = $state({ value: "", err: "" });
</script>

<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
  <li>
    <h2 class="menu-title">Playlists</h2>
    <ul>
      {#each playlist.playlists as pl}
        <li>
          <button
            onclick={() => {
              window.location.hash = `playlist=${pl[1]}`;
              window.location.reload();
            }}>{pl[0]}</button
          >
        </li>
      {/each}
      <li>
        <button
          onclick={() => {
            const el = document.getElementById("playlist") as HTMLDialogElement;
            el.showModal();
          }}>Custom playlist</button
        >
      </li>
    </ul>
  </li>

  <li>
    <h2 class="menu-title">Skins</h2>
    <ul>
      <li><a href={href("/spotify/desktop")}>Desktop</a></li>
      <li><a href={href("/spotify/keypad")}>Keypad</a></li>
      <li><a href={href("/spotify/vinyl")}>Vinyl</a></li>
    </ul>
  </li>

  <li>
    <h2 class="menu-title">Links</h2>
    <ul>
      <li><a href={href("/")}>Home</a></li>
      <li>
        <button
          onclick={() => {
            window.location.reload();
          }}>Reload</button
        >
      </li>
      <li><a href="https://github.com/nzoschke/jukelab">GitHub</a></li>
    </ul>
  </li>
</ul>

<dialog id="playlist" class="modal">
  <div class="modal-box w-full text-center">
    <h3 class="pb-4 text-lg font-bold">Custom playlist</h3>
    <p>Paste a Spotify Playlist URL.</p>
    <input
      type="text"
      placeholder="https://open.spotify.com/playlist/2To3oHfuHL72mGOApNL7bL"
      bind:value={playlistIn.value}
      class="input w-full"
      class:input-error={playlistIn.err}
    />
    <div class="label">
      <span class="label-text-alt text-error" class:hidden={!playlistIn.err}>{playlistIn.err}</span>
    </div>
    <form method="dialog">
      <div class="modal-action">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
        <button
          class="btn btn-accent"
          onclick={async (e) => {
            e.preventDefault();
            playlistIn.err = "";
            // https://open.spotify.com/playlist/2To3oHfuHL72mGOApNL7bL
            const ms = playlistIn.value.match(/playlist\/(\w+)/);
            if (!ms) {
              playlistIn.err = "Invalid Spotify playlist URL";
              return;
            }

            window.location.hash = `playlist=spotify:playlist:${ms[1]}`;
            window.location.reload();
          }}>OK</button
        >
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
