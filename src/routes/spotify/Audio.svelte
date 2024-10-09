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
  let endedAt = 0;
  let player: Spotify.Player | undefined;

  const onState = (s: Spotify.PlaybackState | null | undefined) => {
    if (!s) return;

    const {
      paused,
      position,
      timestamp,
      track_window: { current_track, previous_tracks },
    } = s;

    if (!current_track) return;
    const { id, duration_ms } = current_track;

    // determine end of track
    // https://github.com/spotify/web-playback-sdk/issues/35#issuecomment-509159445
    // https://github.com/metabrainz/listenbrainz-server/blob/d6c612d6e51d28c392bafba42dd27f0e73286e34/frontend/js/src/common/brainzplayer/SpotifyPlayer.tsx#L536
    if (
      paused &&
      position == 0 &&
      previous_tracks?.findIndex((t) => t.id === id) !== -1 &&
      timestamp > endedAt + 500
    ) {
      endedAt = timestamp;
      audio.ended = true;
      audio.readyState = ReadyState.Nothing;

      return;
    }

    audio.currentTime = position / 1000;
    audio.duration = duration_ms / 1000;
    audio.readyState = ReadyState.EnoughData;
  };

  const playPause = async (paused: boolean, src: string) => {
    if (!player) return;

    if (paused) {
      return player.pause();
    }

    audio.ended = false;

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
