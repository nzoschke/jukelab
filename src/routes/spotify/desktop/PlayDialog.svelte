<script lang="ts">
  import { photoboothEnabled, cameraStream } from "$lib/photobooth";
  import type { AlbumTrack } from "../playlist.svelte";
  import { onMount } from "svelte";
  import "@tensorflow/tfjs-backend-webgl";
  import * as bodySegmentation from "@tensorflow-models/body-segmentation";
  import type { BodySegmenter } from "@tensorflow-models/body-segmentation";

  let {
    track,
    onPlay,
  }: {
    track: AlbumTrack;
    onPlay: (photoData?: string) => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let videoElement = $state<HTMLVideoElement>();
  let segmenter: BodySegmenter;

  export function showModal() {
    dialog.showModal();
  }

  onMount(() => {
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const loadedSegmenter = bodySegmentation
      .createSegmenter(model, {
        runtime: "tfjs",
        modelType: "general",
      })
      .then((s) => (segmenter = s))
      .catch((err) => console.error(err));
  });

  $effect(() => {
    if (videoElement && $cameraStream && $photoboothEnabled) {
      videoElement.srcObject = $cameraStream;
      videoElement.play().catch(console.error);
    }
  });

  const drawimage = async (
    webcam: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = webcam.videoWidth;
    tempCanvas.height = webcam.videoHeight;
    const tempCtx = tempCanvas.getContext("2d");

    async function drawMask() {
      requestAnimationFrame(drawMask);
      if (!segmenter || !tempCtx) return;

      const segmentation = await segmenter.segmentPeople(webcam);
      const mask = await bodySegmentation.toBinaryMask(segmentation);
      tempCtx.putImageData(mask, 0, 0);

      context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
      context.restore();
    }

    drawMask();
  };

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
</script>

<dialog class="modal" bind:this={dialog}>
  <div class="modal-box text-center">
    <p class="text-lg font-bold">{track?.track.title}</p>
    <p>{track?.track.artist}</p>
    {#if $photoboothEnabled}
      <div class="flex aspect-square w-full items-center justify-center pt-4">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
          autoplay
          playsinline
          bind:this={videoElement}
          class="mirror-video aspect-square w-full object-cover"
        >
        </video>
      </div>
    {/if}
    <form method="dialog">
      <button
        type="button"
        class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2"
        onclick={cancel}>✕</button
      >
      <div class="modal-action justify-between">
        <button type="button" class="btn btn-neutral" onclick={cancel}>Cancel</button>
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
    <button type="button" onclick={cancel}>close</button>
  </form>
</dialog>

<style type="text/css">
  .mirror-video {
    transform: scaleX(-1);
  }
</style>
