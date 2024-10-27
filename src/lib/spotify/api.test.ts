import { API } from "$lib/spotify/api";
import { assert, test } from "vitest";
import { devToken } from "./auth";

const token = (await devToken()) || "";
const api = API(async () => token);

test("album", async () => {
  const a = await api.album("spotify:album:1iVsD8ZLyrdmTJBinwqq5j");
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
  const a = await api.albumTracks("spotify:album:1iVsD8ZLyrdmTJBinwqq5j");
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

test("compilation", async () => {
  // https://open.spotify.com/playlist/5zyp0d80VUrqV0diZWUM8U?si=789b8455026844de
  const a = await api.compilation("spotify:playlist:5zyp0d80VUrqV0diZWUM8U");
  assert.deepEqual(a, {
    art: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84694fe565fdae754ddbd4f203",
    artist: "Soulwax",
    barcode: "",
    compilation: true,
    discs: 1,
    genre: "",
    src: "spotify:playlist:5zyp0d80VUrqV0diZWUM8U",
    title: "2ManyMP3s",
    tracks: a.tracks,
    year: new Date(0),
  });

  assert.lengthOf(a.tracks, 49);

  assert.deepEqual(a.tracks[0], {
    album: "2ManyMP3s",
    albumArtist: "Soulwax",
    artist: "Peggy Gou",
    bpm: 0,
    comment:
      "https://p.scdn.co/mp3-preview/058c7b9217aab439d95a06525c7a549f6af205cb?cid=adaaf209fb064dfab873a71817029e0d",
    disc: 1,
    genre: "",
    isrc: "GBJX32275010",
    key: "",
    length: 410880,
    mood: "",
    src: "spotify:track:577TxxoJTaW1BxH6EUDlTS",
    title: "I Go - Soulwax Remix",
    track: 1,
    type: "spotify",
    year: new Date("2022-03-30T00:00:00.000Z"),
  });
});

test("playlist", async () => {
  const p = await api.playlist("spotify:playlist:0JOnan9Ym7vJ485NEfdu5E");

  assert.deepEqual(p, {
    art: "https://mosaic.scdn.co/640/ab67616d00001e027762663eeab308df9d240cd0ab67616d00001e0297f3ea19ff79fff4f30a32e7ab67616d00001e02c41f4e1133b0e6c5fcf58680ab67616d00001e02de3c04b5fc750b68899b20a9",
    comment:
      "100 records for your party jukebox. Indie, classics and our current favorites. https:&#x2F;&#x2F;jukelab.com&#x2F;",
    id: "AAAAg/IxQudZeCG7lVI0u/3FLxwEP1XP",
    owner: "JukeLab",
    src: "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E",
    title: "JukeLab 101",
    tracks: p.tracks,
  });

  assert.lengthOf(p.tracks, 100);
  assert.deepEqual(p.tracks[0], {
    album: "Electric Warrior [Expanded & Remastered]",
    albumArtist: "T. Rex",
    artist: "T. Rex",
    bpm: 0,
    comment:
      "https://p.scdn.co/mp3-preview/b044a8698ee1d26f2da15d1be4ec05fe180f88bf?cid=adaaf209fb064dfab873a71817029e0d",
    disc: 1,
    genre: "",
    isrc: "USRE10300007",
    key: "",
    length: 267000,
    mood: "",
    src: "spotify:track:6FsQrRpBLgsrFeAeiQqytm",
    title: "Bang a Gong (Get It On) - 2003 Remaster",
    track: 6,
    type: "spotify",
    year: new Date("1971-09-24T00:00:00.000Z"),
  });
});

test("track", async () => {
  const t = await api.track("spotify:track:0UE1PJiUk9oFkbHIg6m2iC");
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

test("trackAlbum", async () => {
  const a = await api.trackAlbum("spotify:track:0UE1PJiUk9oFkbHIg6m2iC");

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
});

test.skip("tracksAlbum", { timeout: 60000 }, async () => {
  const p = await api.playlist("spotify:playlist:0JOnan9Ym7vJ485NEfdu5E");
  const as = await api.tracksAlbums(p.tracks);
  console.log(JSON.stringify(as));
});
