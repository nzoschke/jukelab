<script lang="ts">
  import { photoboothEnabled, cameraStream } from "$lib/photobooth";
  import type { AlbumTrack } from "../playlist.svelte";

  let {
    track,
    onPlay,
    open = $bindable(),
  }: {
    track: AlbumTrack;
    onPlay: (photo?: string) => void;
    open: boolean;
  } = $props();

  let videoElement = $state<HTMLVideoElement>();
  let countdown = $state(0);
  let flash = $state(false);

  // svelte-ignore non_reactive_update
  let modal: HTMLDialogElement | null = null;

  $effect(() => {
    if (open) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  });

  $effect(() => {
    if (videoElement && $cameraStream && $photoboothEnabled) {
      videoElement.srcObject = $cameraStream;
      videoElement.play().catch(console.error);
    }
  });

  async function confirm(takePicture: boolean) {
    let photo: string | undefined;

    if (takePicture && $photoboothEnabled && videoElement) {
      const side = Math.min(videoElement.videoWidth, videoElement.videoHeight);

      const dpr = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      canvas.width = side * dpr;
      canvas.height = side * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);

        const sx = (videoElement.videoWidth - side) / 2;
        const sy = (videoElement.videoHeight - side) / 2;

        ctx.save();
        ctx.translate(side, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, sx, sy, side, side, 0, 0, side, side);
        ctx.restore();

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = track.album.art;

        await new Promise((resolve, reject) => {
          img.onload = () => {
            const size = side * 0.34;
            const padding = side * 0.02;
            ctx.drawImage(img, side - size - padding, padding, size, size);
            resolve(null);
          };
          img.onerror = reject;
        });

        photo = canvas.toDataURL("image/png");
      }
    }

    if (photo) {
      const a = document.createElement("a");
      a.href = photo;
      a.download = `photo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    if (onPlay) onPlay(photo);
    open = false;
  }

  async function startCountdown() {
    countdown = 3;

    while (countdown > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      countdown -= 1;
    }

    flash = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    flash = false;

    confirm(true);
  }

  const onClose = () => {
    open = false;
  };
</script>

{#if open}
  <dialog bind:this={modal} onclose={() => (open = false)} class="modal">
    <div class="modal-box relative text-center">
      <p class="text-lg font-bold">{track?.track.title}</p>
      <p>{track?.track.artist}</p>
      {#if $photoboothEnabled}
        <div class="relative flex aspect-square w-full pt-4">
          <video
            autoplay
            playsinline
            bind:this={videoElement}
            class="mirror-video absolute left-0 top-0 h-full w-full"
          ></video>
          <div class="absolute right-2 top-2">
            <img src={track.album.art} alt="Album Art" class="h-40 w-40 rounded-sm" />
          </div>

          {#if countdown > 0}
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-6xl font-bold text-white drop-shadow-lg">{countdown}</div>
            </div>
          {/if}
        </div>
      {/if}
      <form method="dialog">
        <button
          type="button"
          class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2"
          onclick={onClose}>✕</button
        >
        <div class="modal-action justify-between">
          <button
            type="button"
            class="btn btn-neutral"
            class:btn-disabled={countdown > 0}
            onclick={onClose}>Cancel</button
          >
          <div class="flex gap-2">
            {#if $photoboothEnabled}
              <button
                type="button"
                class="btn btn-neutral"
                class:btn-disabled={countdown > 0}
                aria-disabled="true"
                onclick={() => confirm(false)}>Just Queue</button
              >
              <button type="button" class="btn btn-primary" onclick={startCountdown}
                >Photo + Queue</button
              >
            {:else}
              <button type="button" class="btn btn-primary" onclick={() => confirm(false)}
                >Queue</button
              >
            {/if}
          </div>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button type="button" onclick={onClose}>close</button>
    </form>

    {#if flash}
      <div class="flash-overlay"></div>
    {/if}
  </dialog>
{/if}

<style type="text/css">
  .mirror-video {
    transform: scaleX(-1);
  }

  @keyframes flashAnimation {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .flash-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    animation: flashAnimation 0.5s ease-out;
    pointer-events: none;
    z-index: 50000;
  }
</style>
