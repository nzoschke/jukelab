<script lang="ts">
  import { Audio } from "$lib/types/audio";
  import { Track } from "$lib/types/music";
  import Controls from "../audio/Controls.svelte";
  import { API } from "$lib/spotify/api";
  import AudioC from "./Audio.svelte";
  import Header from "../Header.svelte";
  import { Icon, ArrowTopRightOnSquare } from "svelte-hero-icons";
  import { href } from "$lib/href";

  let src = "spotify:track:0UK7txy2sUR6kqvEZtx72w";

  let error = $state("");
  let token = $state("");
  let track = $state(Track);
  let audio = $state(Audio);

  const oninput = async () => {
    if (token == "") {
      error = "";
      return;
    }

    const api = API(async () => token);
    try {
      track = await api.track(src);
      error = "";
    } catch (e) {
      if (token == "") return;

      error = String(e);
      if (e instanceof Error) {
        error = e.message;
      }
    }
  };
</script>

<svelte:head>
  <title>Spotify</title>
  <meta name="description" content="Spotify" />
</svelte:head>

<div class="flex w-full flex-col items-center space-y-8">
  <Header />

  <div class="flex w-full max-w-2xl flex-col items-center space-y-8">
    <h1 class="text-5xl font-bold">Spotify</h1>

    <div class="prose">
      <p>
        JukeLab is built on <a href="https://developer.spotify.com/documentation/web-playback-sdk"
          >Spotify Web Playback SDK</a
        >. Just like <a href={href("/audio")}>HTML Audio</a>, you can bind properties of a
        <a
          href="https://developer.spotify.com/documentation/web-playback-sdk/reference#spotifyplayer"
          >Spotify Player</a
        > component to easily build a custom player UI.
      </p>
      <p>Note that this requires logging into Spotify Premium and getting an access token.</p>

      <label class="form-control">
        <div class="label">
          <span class="label-text"
            >Access token from <a
              target="_blank"
              href="https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started"
              >Getting Started with Web Playback SDK
              <Icon
                src={ArrowTopRightOnSquare}
                solid
                class="mb-1 inline size-5"
                aria-hidden="false"
                aria-label="next"
                role="img"
              />
            </a>
          </span>
        </div>
        <input
          type="text"
          placeholder="Paste access token"
          class="input input-bordered"
          class:input-error={error != ""}
          class:input-success={track.src != ""}
          bind:value={token}
          {oninput}
        />
        <div class="label">
          <span class="label-text-alt">{error}</span>
        </div>
      </label>
    </div>

    <Controls bind:audio />

    {#if track.src != ""}
      <div class="flex flex-col items-center">
        <div class="font-bold">{track.title}</div>
        <div>{track.artist}</div>
      </div>
      <AudioC bind:audio src={track.src} token={async () => token} />
    {/if}
  </div>
</div>
