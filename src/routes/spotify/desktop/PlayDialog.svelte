<script lang="ts">
  import { photoboothEnabled, cameraStream } from "$lib/photobooth";
  import type { AlbumTrack } from "../playlist.svelte";
  import { onMount } from "svelte";

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
            const size = side * 0.32;
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

  const onClose = () => {
    open = false;
  };
</script>

{#if open}
  <dialog bind:this={modal} onclose={() => (open = false)} class="modal">
    <div class="modal-box text-center">
      <p class="text-lg font-bold">{track?.track.title}</p>
      <p>{track?.track.artist}</p>
      {#if $photoboothEnabled}
        <div class="relative flex aspect-square w-full pt-4">
          <!-- svelte-ignore a11y_media_has_caption -->
          <video
            autoplay
            playsinline
            bind:this={videoElement}
            class="mirror-video absolute left-0 top-0 h-full w-full"
          >
          </video>
          <div class="absolute right-2 top-2">
            <img src={track.album.art} alt="Album Art" class="h-40 w-40 rounded-sm" />
          </div>
        </div>
      {/if}
      <form method="dialog">
        <button
          type="button"
          class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2"
          onclick={onClose}>✕</button
        >
        <div class="modal-action justify-between">
          <button type="button" class="btn btn-neutral" onclick={onClose}>Cancel</button>
          <div class="flex gap-2">
            {#if $photoboothEnabled}
              <button type="button" class="btn btn-neutral" onclick={() => confirm(false)}
                >Just Queue</button
              >
              <button type="button" class="btn btn-primary" onclick={() => confirm(true)}
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
  </dialog>
{/if}

<style type="text/css">
  .mirror-video {
    transform: scaleX(-1);
  }
</style>
