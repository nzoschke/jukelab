import type { Album, AlbumTracks, Playlist, PlaylistTracks, Track } from "$lib/types/music";
import * as s from "@spotify/web-api-ts-sdk";

type SAlbum = s.Album | s.SimplifiedAlbum;
type STrack = s.Track | s.SimplifiedTrack;

export const API = (token: () => Promise<string>) => {
  const api = async () =>
    s.SpotifyApi.withAccessToken("", {
      access_token: await token(),
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

  const compilation = async (uri: string): Promise<AlbumTracks> => {
    const a = await api();
    const out = await a.playlists.getPlaylist(uri.split(":")[2]);
    const parts = out.name.split(" by ");

    const album: AlbumTracks = {
      art: out.images[0].url,
      artist: parts[1],
      barcode: "",
      compilation: true,
      discs: 1, // FIXME
      genre: "",
      src: uri,
      title: parts[0],
      tracks: [],
      year: new Date(0),
    };

    album.tracks = out.tracks.items.map((pt) => {
      const a = album;
      const t = pt.track;

      return {
        album: a.title,
        albumArtist: a.artist,
        artist: t.artists[0].name,
        bpm: 0,
        comment: t.preview_url || "",
        disc: t.disc_number,
        genre: a.genre,
        isrc: t.external_ids?.isrc || "",
        key: "",
        length: t.duration_ms,
        mood: "",
        src: t.uri,
        track: t.track_number,
        title: t.name,
        type: "spotify",
        year: new Date(t.album.release_date),
      };
    });

    return album;
  };

  const compilations = async (userUri: string): Promise<s.SimplifiedPlaylist[]> => {
    const ps = await playlists(userUri);
    return ps.filter((p) => p.description.includes("JukeLab compilation"));
  };

  const playlist = async (uri: string): Promise<PlaylistTracks> => {
    const a = await api();
    const out = await a.playlists.getPlaylist(uri.split(":")[2]);

    const playlist = _playlist(out) as PlaylistTracks;
    playlist.tracks = out.tracks.items.map((i) => _track(i.track.album, i.track));
    return playlist;
  };

  const playlists = async (userUri: string): Promise<s.SimplifiedPlaylist[]> => {
    const a = await api();

    a.playlists.getUsersPlaylists(userUri.split(":")[2]);
    let ps: s.SimplifiedPlaylist[] = [];
    let offset = 0;
    let total = 1;
    while (offset < total) {
      const out = await a.playlists.getUsersPlaylists(userUri.split(":")[2]);
      total = out.total;
      offset += out.limit;
      ps.push(...out.items);
    }

    return ps;
  };

  const playlistAlbums = async (
    playlistUri: string,
    cb?: (album: AlbumTracks) => void,
  ): Promise<AlbumTracks[]> => {
    const a = await api();

    const out = await a.playlists.getPlaylist(playlistUri.split(":")[2]);
    const comps = await compilations(out.owner.uri);

    const p = await playlist(playlistUri);
    const albums: AlbumTracks[] = [];
    for (const t of p.tracks) {
      const comp = comps.find((c) => c.description.includes(t.src.split(":")[2]));
      const a = comp ? await compilation(comp.uri) : await trackAlbum(t.src);
      albums.push(a);
      if (cb) cb(a);

      // FIXME: avoid rate limit
      await new Promise((r) => setTimeout(r, 10));
    }

    return albums;
  };

  const track = async (uri: string) => {
    const a = await api();
    const out = await a.tracks.get(uri.split(":")[2]);

    return _track(out.album, out);
  };

  const trackAlbum = async (uri: string) => {
    const a = await api();
    const out = await a.tracks.get(uri.split(":")[2]);

    return albumTracks(out.album.uri);
  };

  return {
    album,
    albumTracks,
    compilations,
    playlist,
    playlists,
    playlistAlbums,
    track,
    trackAlbum,
  };
};
