import { assert, test } from "vitest";
import { API } from "./api";
import { env } from "$env/dynamic/public";

const s = API(env.PUBLIC_SPOTIFY_TOKEN);

test("album", async () => {
  const a = await s.album("spotify:album:1iVsD8ZLyrdmTJBinwqq5j");
  assert.deepEqual(a, {
    art: "https://i.scdn.co/image/ab67616d0000b273d277db349be4465265387adf",
    artist: "The Greatest Bits",
    barcode: "1827849487699",
    compilation: false,
    discs: 1,
    genre: "",
    src: "spotify:album:1iVsD8ZLyrdmTJBinwqq5j",
    title: "Super Mario 64",
    year: new Date("2018-01-17T00:00:00.000Z"),
  });
});

test("albumTracks", async () => {
  const a = await s.albumTracks("spotify:album:1iVsD8ZLyrdmTJBinwqq5j");
  assert.deepEqual(a, {
    art: "https://i.scdn.co/image/ab67616d0000b273d277db349be4465265387adf",
    artist: "The Greatest Bits",
    barcode: "1827849487699",
    compilation: false,
    discs: 1,
    genre: "",
    src: "spotify:album:1iVsD8ZLyrdmTJBinwqq5j",
    title: "Super Mario 64",
    tracks: a.tracks,
    year: new Date("2018-01-17T00:00:00.000Z"),
  });

  assert.lengthOf(a.tracks, 10);

  assert.deepEqual(a.tracks[0], {
    album: "Super Mario 64",
    albumArtist: "The Greatest Bits",
    artist: "The Greatest Bits",
    bpm: 0,
    comment:
      "https://p.scdn.co/mp3-preview/d4e744aefa6cfae56c3c980bf51707ee02e3b62c?cid=adaaf209fb064dfab873a71817029e0d",
    disc: 1,
    genre: "",
    isrc: "",
    key: "",
    length: 137948,
    mood: "",
    src: "spotify:track:0UE1PJiUk9oFkbHIg6m2iC",
    title: "Super Mario 64 Main Theme (Bob-omb Battlefield)",
    track: 1,
    type: "spotify",
    year: new Date("2018-01-17T00:00:00.000Z"),
  });
});

test("track", async () => {
  const t = await s.track("spotify:track:0UE1PJiUk9oFkbHIg6m2iC");
  assert.deepEqual(t, {
    album: "Super Mario 64",
    albumArtist: "The Greatest Bits",
    artist: "The Greatest Bits",
    bpm: 0,
    comment:
      "https://p.scdn.co/mp3-preview/d4e744aefa6cfae56c3c980bf51707ee02e3b62c?cid=adaaf209fb064dfab873a71817029e0d",
    disc: 1,
    genre: "",
    isrc: "QZ22B1868791",
    key: "",
    length: 137948,
    mood: "",
    src: "spotify:track:0UE1PJiUk9oFkbHIg6m2iC",
    title: "Super Mario 64 Main Theme (Bob-omb Battlefield)",
    track: 1,
    type: "spotify",
    year: new Date("2018-01-17T00:00:00.000Z"),
  });
});
