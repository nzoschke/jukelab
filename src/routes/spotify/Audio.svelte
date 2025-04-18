<script lang="ts">
  import { Audio, ReadyState } from "$lib/types/audio";
  import { onMount } from "svelte";
  import type { Level } from "./log.svelte";

  let {
    audio = $bindable(Audio),
    log = (msg: string, level?: Level) => {},
    src = "",
    token,
  }: {
    audio: Audio;
    log?: (msg: string, level?: Level) => void;
    src: string;
    token: () => Promise<string>;
  } = $props();

  let active = false;
  let deviceId = "";
  let endedTs = 0;
  let player: Spotify.Player | undefined;
  let trackId = "";

  const onState = (s: Spotify.PlaybackState | null | undefined) => {
    if (!s) return;

    const {
      paused,
      position,
      timestamp,
      track_window: { current_track, previous_tracks },
    } = s;

    if (!current_track) return;
    const { id, duration_ms, name, artists } = current_track;

    log(
      `onState paused=${paused} position=${position} duration_ms=${duration_ms} id=${id} name=${name} artists=${artists[0].name}`,
    );

    // determine start of track
    if (id && id != trackId) {
      log(`onState start id=${id} name=${name}`);
      trackId = id;
      audio.ended = false;
      return;
    }

    // determine end of track, "debounced" to only send one update
    // https://github.com/spotify/web-playback-sdk/issues/35#issuecomment-509159445
    // https://github.com/metabrainz/listenbrainz-server/blob/d6c612d6e51d28c392bafba42dd27f0e73286e34/frontend/js/src/common/brainzplayer/SpotifyPlayer.tsx#L536
    if (
      paused &&
      position == 0 &&
      previous_tracks?.findIndex((t) => t.id === id) !== -1 &&
      timestamp > endedTs + 500
    ) {
      endedTs = timestamp;
      audio.ended = true;
      log(`onState ended id=${id} name=${name}`);
      return;
    }

    audio.currentTime = position / 1000;
    audio.duration = duration_ms / 1000;
  };

  const playPause = async (paused: boolean, src: string) => {
    if (!player || deviceId == "") return;

    if (paused) {
      return player.pause();
    }

    // immediately update ended to avoid "update depth exceeded"
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
        Authorization: `Bearer ${await token()}`,
      },
      method: "PUT",
    });
  };

  $effect(() => {
    if (!active && !audio.paused) {
      player?.activateElement();
      active = true;
    }
  });

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

  onMount(async () => {
    const t = await token();
    if (!t) return;

    window.onSpotifyWebPlaybackSDKReady = async () => {
      player = new Spotify.Player({
        getOAuthToken: async (cb) => {
          const t = await token();
          log(`getOAuthToken ${t.slice(0, 5)}...`, "warning");
          if (t) cb(t);
        },
        name: "JukeLab",
        volume: 1.0,
      });

      player.addListener("player_state_changed", (e) => {
        onState(e);
      });

      player.addListener("ready", ({ device_id }) => {
        audio.readyState = ReadyState.EnoughData;
        deviceId = device_id;
        log(`ready ${device_id}`);
      });

      player.addListener("not_ready", ({ device_id }) => {
        log(`not_ready ${device_id}`, "warning");
      });

      player.addListener("initialization_error", ({ message }) => {
        log(`initialization_error ${message}`, "error");
      });

      player.addListener("authentication_error", ({ message }) => {
        log(`authentication_error ${message}`, "error");
      });

      player.addListener("account_error", ({ message }) => {
        log(`account_error ${message}`, "error");
      });

      await player.connect();

      setInterval(async () => {
        onState(await player?.getCurrentState());
      }, 1000);
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.head.appendChild(script);
  });
</script>
