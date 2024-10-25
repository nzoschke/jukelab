import type { Album, Track } from "$lib/types/music";
import { AlbumTrack, Playlist } from "./playlist.svelte";

export const Select = (playlist: ReturnType<typeof Playlist>) => {
  let num = $state("____");
  let timeout = setTimeout(() => {}, 0);
  let track = $state(AlbumTrack);

  const enqueue = async () => {
    await playlist.enqueue(track);

    const el = document.getElementById("enqueue") as HTMLDialogElement;
    el.showModal();
    setTimeout(() => {
      el.close();
    }, 2500);
  };

  const select = (album: Album, t: Track) => {
    track = playlist.find({ albumSrc: album.src, trackSrc: t.src });
    const el = document.getElementById("select") as HTMLDialogElement;
    el.showModal();
  };

  const char = (c: string) => {
    // reset partial selection after 15s
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      num = "____";
    }, 15 * 1000);

    num = c == "x" ? "____" : num.replace("_", c);
    if (num == "XXXX" || num.indexOf("_") >= 0) return;

    // process 4 digits
    clearTimeout(timeout);
    setTimeout(() => {
      num = "____";
    }, 1000);

    // albums start at 00, tracks at 01
    const ai = parseInt(num.slice(0, 2));
    const ti = parseInt(num.slice(2, 4)) - 1;

    if (ti < 0) {
      num = "XXXX";
      return;
    }

    const album = playlist.albums.at(ai);
    if (!album) {
      num = "XXXX";
      return;
    }

    const track = album.tracks.at(ti);
    if (!track) {
      num = "XXXX";
      return;
    }

    select(album, track);
  };

  return {
    char,
    enqueue,
    select,

    get num() {
      return num;
    },
    get track() {
      return track;
    },
  };
};
