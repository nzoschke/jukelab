import { writable } from "svelte/store";

export const photoboothEnabled = writable(false);
export const cameraStream = writable<MediaStream | null>(null);

export async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1024 }, height: { ideal: 1024 } },
    });
    cameraStream.set(stream);
  } catch (err) {
    console.error("Error starting camera", err);
  }
}

export function stopCamera() {
  cameraStream.update((stream) => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    return null;
  });
}
