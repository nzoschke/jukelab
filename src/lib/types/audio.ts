// References:
// - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
// - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
// - https://svelte.dev/docs/element-directives#media-element-bindings

export interface Audio {
  // buffered
  currentTime: number;
  duration: number; // sec
  ended: boolean;
  muted: boolean;
  paused: boolean;
  playbackRate: number;
  // played
  readyState: ReadyState;
  // seekable
  seeking: boolean;
  volume: number;
}

export enum ReadyState {
  Nothing = 0,
  Metadata,
  CurrentData,
  FutureData,
  EnoughData,
}

// Constants

export const Audio: Audio = {
  currentTime: 0,
  duration: 0,
  ended: false,
  muted: false,
  paused: true,
  playbackRate: 1.0,
  readyState: 0,
  seeking: false,
  volume: 1.0,
};
