import type { Album, AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
import * as s from "@spotify/web-api-ts-sdk";

type SAlbum = s.Album | s.SimplifiedAlbum;
type STrack = s.Track | s.SimplifiedTrack;

export const album = (a: SAlbum): Album => ({
  art: a.images.at(0)?.url || "",
  artist: a.artists[0].name,
  barcode: a.external_ids.upc,
  compilation: a.album_type == "compilation",
  discs: 1, // FIXME
  genre: a.genres[0] || "",
  src: a.uri,
  title: a.name,
  year: new Date(a.release_date),
});

export const albumTracks = (a: SAlbum): AlbumTracks => {
  const al = album(a) as AlbumTracks;
  al.tracks = [];
  return al;
};

export const compAlbum = (p: s.Playlist): SAlbum => {
  const parts = p.name.split(" by ");

  return {
    album_group: "",
    artists: [
      {
        external_urls: {
          spotify: "",
        },
        href: "",
        id: "",
        name: parts[1],
        type: "",
        uri: "",
      },
    ],
    album_type: "compilation",
    available_markets: [],
    copyrights: [],
    external_ids: {
      upc: "",
      isrc: "",
      ean: "",
    },
    external_urls: {
      spotify: "",
    },
    genres: [],
    href: "",
    id: "",
    images: p.images,
    label: "",
    name: parts[0],
    popularity: 0,
    release_date: p.tracks.items[0].added_at,
    release_date_precision: "",
    total_tracks: 0,
    type: "",
    uri: p.uri,
  };
};

export const playlist = (p: s.Playlist): PlaylistTracks => ({
  art: p.images[0].url,
  id: p.snapshot_id,
  comment: p.description,
  owner: p.owner.display_name,
  src: p.uri,
  title: p.name,
  tracks: [],
});

export const track = (a: SAlbum, t: STrack): Track => ({
  album: a.name,
  albumArtist: a.artists[0].name,
  artist: t.artists[0].name,
  bpm: 0,
  comment: t.preview_url || "",
  disc: t.disc_number,
  genre: a.genres?.length > 0 ? a.genres[0] : "",
  isrc: (t as s.Track).external_ids?.isrc || "",
  key: "",
  length: t.duration_ms,
  mood: "",
  src: t.uri,
  track: t.track_number,
  title: t.name,
  type: "spotify",
  year: new Date(a.release_date),
});
