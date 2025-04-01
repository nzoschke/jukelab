<script lang="ts">
  import { photoboothEnabled, cameraStream } from "$lib/photobooth";
  import type { AlbumTrack } from "../playlist.svelte";
  import { onMount } from "svelte";

  let {
    track,
    onPlay,
  }: {
    track: AlbumTrack;
    onPlay: (photoData?: string) => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let videoElement = $state<HTMLVideoElement>();

  export function showModal() {
    dialog.showModal();
  }

  async function confirm(takePicture: boolean) {
    let photoData: string | undefined;

    if (takePicture && $photoboothEnabled && videoElement) {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL("image/png");
      }
    }

    if (photoData) {
      const a = document.createElement("a");
      a.href = photoData;
      a.download = `photo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    if (onPlay) onPlay(photoData);
    dialog.close();
  }

  function cancel() {
    dialog.close();
  }

  $effect(() => {
    if (videoElement && $cameraStream && $photoboothEnabled) {
      videoElement.srcObject = $cameraStream;
      videoElement.play().catch(console.error);
    }
  });
</script>

<dialog class="modal" bind:this={dialog}>
  <div class="modal-box text-center">
    <h3 class="pb-4 text-lg font-bold">Queue</h3>
    <p class="text-lg font-bold">{track?.track.title}</p>
    <p>{track?.track.artist}</p>
    {#if $photoboothEnabled}
      <div class="flex h-80 w-full items-center justify-center pt-4">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
          autoplay
          playsinline
          bind:this={videoElement}
          class="mirror-video max-h-full max-w-full"
        >
        </video>
      </div>
    {/if}
    <form method="dialog">
      <div class="modal-action justify-between">
        <button
          type="button"
          class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          onclick={cancel}>✕</button
        >
        <button type="button" class="btn" onclick={cancel}>Cancel</button>
        <div class="flex-col gap-8">
          {#if $photoboothEnabled}
            <button type="button" class="btn btn-primary" onclick={() => confirm(true)}
              >Enqueue with photo</button
            >
          {/if}
          <button type="button" class="btn btn-accent" onclick={() => confirm(false)}
            >Just enqueue</button
          >
        </div>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="button" onclick={cancel}>close</button>
  </form>
</dialog>

<style type="text/css">
  .mirror-video {
    transform: scaleX(-1);
  }
</style>
