import { env } from "$env/dynamic/public";
import type { Album, AlbumTracks, Track } from "$lib/types/music";
import * as s from "@spotify/web-api-ts-sdk";

export const token = async () => env.PUBLIC_SPOTIFY_TOKEN;

type SAlbum = s.Album | s.SimplifiedAlbum;
type STrack = s.Track | s.SimplifiedTrack;

export const API = () => {
  const client = async () =>
    s.SpotifyApi.withAccessToken("", {
      access_token: await token(),
      token_type: "",
      expires_in: 3600,
      refresh_token: "",
    });

  const _album = (a: SAlbum): Album => {
    return {
      art: a.images.at(0)?.url || "",
      artist: a.artists[0].name,
      barcode: a.external_ids.upc,
      compilation: a.album_type == "compilation",
      discs: 1, // FIXME
      genre: a.genres[0] || "",
      src: a.uri,
      title: a.name,
      year: new Date(a.release_date),
    };
  };

  const _track = (a: SAlbum, t: STrack): Track => {
    return {
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
    };
  };

  const album = async (uri: string): Promise<Album> => {
    const c = await client();
    const parts = uri.split(":");
    const a = await c.albums.get(parts[2]);

    return _album(a);
  };

  const albumTracks = async (uri: string): Promise<AlbumTracks> => {
    const c = await client();
    const parts = uri.split(":");
    const a = await c.albums.get(parts[2]);

    const album = _album(a) as AlbumTracks;
    album.tracks = a.tracks.items.map((t) => {
      return _track(a, t);
    });

    return album;
  };

  const track = async (uri: string): Promise<Track> => {
    const c = await client();
    const parts = uri.split(":");
    const t = await c.tracks.get(parts[2]);

    return _track(t.album, t);
  };

  return {
    album,
    albumTracks,
    track,
  };
};
