import type { Album, AlbumTracks, Playlist, PlaylistTracks, Track } from "$lib/types/music";
import * as s from "@spotify/web-api-ts-sdk";
import { Auth } from "./auth";

type SAlbum = s.Album | s.SimplifiedAlbum;
type STrack = s.Track | s.SimplifiedTrack;

export const API = (token?: string) => {
  const auth = Auth();

  const api = async () =>
    s.SpotifyApi.withAccessToken("", {
      access_token: token || (await auth.token()) || "",
      token_type: "",
      expires_in: 3600,
      refresh_token: "",
    });

  const _album = (a: SAlbum): Album => ({
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

  const _playlist = (p: s.Playlist): Playlist => ({
    art: p.images[0].url,
    id: p.snapshot_id,
    comment: p.description,
    owner: p.owner.display_name,
    src: p.uri,
    title: p.name,
  });

  const _track = (a: SAlbum, t: STrack): Track => ({
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

  const album = async (uri: string) => {
    const a = await api();
    const out = await a.albums.get(uri.split(":")[2]);

    return _album(out);
  };

  const albumTracks = async (uri: string) => {
    const a = await api();
    const out = await a.albums.get(uri.split(":")[2]);

    const album = _album(out) as AlbumTracks;
    album.tracks = out.tracks.items.map((t) => _track(out, t));
    return album;
  };

  const playlist = async (uri: string): Promise<PlaylistTracks> => {
    const a = await api();
    const out = await a.playlists.getPlaylist(uri.split(":")[2]);

    const playlist = _playlist(out) as PlaylistTracks;
    playlist.tracks = out.tracks.items.map((i) => _track(i.track.album, i.track));
    return playlist;
  };

  const trackAlbum = async (uri: string) => {
    const a = await api();
    const out = await a.tracks.get(uri.split(":")[2]);

    return albumTracks(out.album.uri);
  };

  const track = async (uri: string) => {
    const a = await api();
    const out = await a.tracks.get(uri.split(":")[2]);

    return _track(out.album, out);
  };

  return {
    album,
    albumTracks,
    playlist,
    track,
    trackAlbum,
  };
};
