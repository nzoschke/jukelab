import { env } from "$env/dynamic/public";
import type { Album, Track } from "$lib/types/music";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const token = async () => env.PUBLIC_SPOTIFY_TOKEN;

export const API = () => {
  const client = async () =>
    SpotifyApi.withAccessToken("", {
      access_token: await token(),
      token_type: "",
      expires_in: 3600,
      refresh_token: "",
    });

  const album = async (uri: string): Promise<Album> => {
    const c = await client();
    const parts = uri.split(":");
    const a = await c.albums.get(parts[2]);

    return {
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

  const track = async (uri: string): Promise<Track> => {
    const c = await client();
    const parts = uri.split(":");
    const t = await c.tracks.get(parts[2]);

    return {
      album: t.album.name,
      albumArtist: t.album.artists[0].name,
      artist: t.artists[0].name,
      bpm: 0,
      comment: t.preview_url || "",
      disc: t.disc_number,
      genre: t.album.genres ? t.album.genres[0] : "",
      isrc: t.external_ids.isrc,
      key: "",
      length: t.duration_ms,
      mood: "",
      src: t.uri,
      track: t.track_number,
      title: t.name,
      type: "spotify",
      year: new Date(t.album.release_date),
    };
  };

  return {
    album,
    track,
  };
};
