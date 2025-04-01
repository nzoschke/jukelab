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

  // Expose showModal() so the parent can open the dialog.
  export function showModal() {
    dialog.showModal();
  }

  // When confirming, capture the image if photobooth is enabled.
  async function confirm() {
    let photoData: string | undefined;
    if ($photoboothEnabled && videoElement) {
      // Capture a frame from the video preview
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL("image/png");
      }
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
      <div class="flex h-80 w-full items-center justify-center">
        <!-- Video preview reusing the shared camera stream -->
        <video autoplay playsinline bind:this={videoElement} class="max-h-full max-w-full"></video>
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
          <button type="button" class="btn btn-accent" onclick={confirm}> Enqueue </button>
        </div>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="button" onclick={cancel}>close</button>
  </form>
</dialog>
