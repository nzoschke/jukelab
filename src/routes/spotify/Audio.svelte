<script lang="ts">
  import { Audio, ReadyState } from "$lib/types/audio";
  import { onMount } from "svelte";
  import { Auth } from "./auth";

  let {
    audio = $bindable(Audio),
    src = "",
  }: {
    audio: Audio;
    src: string;
  } = $props();

  const auth = Auth();

  let deviceId = "";
  let player: Spotify.Player | undefined;

  let endedAt = 0;
  const onState = (s: Spotify.PlaybackState | null | undefined) => {
    if (!s) return;

    const {
      paused,
      position,
      timestamp,
      track_window: { current_track, previous_tracks },
    } = s;

    if (!current_track) return;

    // SDK sends many starting/stopping events so debounce
    // https://github.com/metabrainz/listenbrainz-server/blob/master/frontend/js/src/brainzplayer/SpotifyPlayer.tsx#L502-L514
    if (
      paused &&
      position == 0 &&
      previous_tracks?.findIndex((t) => t.id === current_track.id) !== -1 &&
      timestamp > endedAt + 500
    ) {
      endedAt = timestamp;
      audio.ended = true;
      return;
    }

    audio.currentTime = position / 1000;
    audio.duration = current_track.duration_ms / 1000;
    audio.readyState = ReadyState.EnoughData;
  };

  const playPause = async (paused: boolean, src: string) => {
    if (!player) return;

    if (paused) {
      return player.pause();
    }

    const s = await player.getCurrentState();
    if (src == s?.track_window.current_track.uri) {
      return player.togglePlay();
    }

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      body: JSON.stringify({
        device_id: deviceId,
        uris: [src],
      }),
      headers: {
        Authorization: `Bearer ${await auth.token()}`,
      },
      method: "PUT",
    });
  };

  $effect(() => {
    playPause(audio.paused, src);
  });

  $effect(() => {
    player?.setVolume(audio.volume);
  });

  $effect(() => {
    audio.muted ? player?.setVolume(0) : player?.setVolume(audio.volume);
  });

  $effect(() => {
    audio.muted = audio.seeking;
    if (!audio.seeking) return;

    // FIXME: scrubbing
    player?.seek(audio.currentTime * 1000);
  });

  onMount(() => {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      player = new Spotify.Player({
        getOAuthToken: async (cb) => {
          const t = await auth.token();
          if (t) cb(t);
        },
        name: "MediaLab",
        volume: 1.0,
      });

      player.addListener("player_state_changed", (e) => {
        onState(e);
      });

      player.addListener("ready", ({ device_id }) => {
        audio.readyState = ReadyState.EnoughData;
        deviceId = device_id;
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log(`not_ready ${device_id}`);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.log(`initialization_error ${message}`);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.log(`authentication_error ${message}`);
      });

      player.addListener("account_error", ({ message }) => {
        console.log(`account_error ${message}`);
      });

      await player.connect();
      await player.activateElement();

      setInterval(async () => {
        onState(await player?.getCurrentState());
      }, 500);
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.head.appendChild(script);
  });
</script>
