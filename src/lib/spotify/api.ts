import * as s from "$lib/storage";
import { AlbumTracks, type PlaylistTracks } from "$lib/types/music";
import * as sdk from "@spotify/web-api-ts-sdk";
import * as to from "./to";

export const API = (token: () => Promise<string>) => {
  const api = async () =>
    sdk.SpotifyApi.withAccessToken("", {
      access_token: await token(),
      token_type: "",
      expires_in: 3600,
      refresh_token: "",
    });

  const album = async (uri: string) => {
    const a = await api();
    const out = await a.albums.get(uri.split(":")[2]);

    return to.album(out);
  };

  const albumTracks = async (uri: string) => {
    let album = s.get(uri, AlbumTracks);
    if (album.src != "") {
      const text = JSON.stringify(album);
      const re = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
      album = JSON.parse(text, (k, v) => {
        if (typeof v == "string" && re.test(v)) {
          return new Date(v);
        }
        return v;
      });

      return album;
    }

    const a = await api();
    const out = await a.albums.get(uri.split(":")[2]);

    album = to.albumTracks(out);
    album.tracks = out.tracks.items.map((t) => to.track(out, t));

    s.set(uri, album);

    return album;
  };

  const compilation = async (playlistUri: string): Promise<AlbumTracks> => {
    const a = await api();
    const out = await a.playlists.getPlaylist(playlistUri.split(":")[2]);

    const sa = to.compAlbum(out);
    const album = to.albumTracks(sa);
    album.tracks = out.tracks.items.map((pt) => {
      return to.track(sa, pt.track);
    });

    return album;
  };

  const compilations = async (userUri: string): Promise<sdk.SimplifiedPlaylist[]> => {
    const ps = await playlists(userUri);
    return ps.filter((p) => p.description.includes("JukeLab compilation"));
  };

  const playlist = async (uri: string): Promise<PlaylistTracks> => {
    const a = await api();
    const id = uri.split(":")[2];
    const out = await a.playlists.getPlaylist(id);

    const ts: sdk.PlaylistedTrack<sdk.Track>[] = [];
    let offset = 0;
    let total = 1;
    while (offset < total) {
      const out = await a.playlists.getPlaylistItems(id, undefined, undefined, 50, offset);
      total = out.total;
      offset += out.limit;
      ts.push(...out.items);
    }

    out.tracks.items = ts;

    const playlist = to.playlist(out);
    playlist.tracks = out.tracks.items.map((i) => to.track(i.track.album, i.track));
    return playlist;
  };

  const playlists = async (userUri: string): Promise<sdk.SimplifiedPlaylist[]> => {
    const a = await api();

    const ps: sdk.SimplifiedPlaylist[] = [];
    let offset = 0;
    let total = 1;
    while (offset < total) {
      const out = await a.playlists.getUsersPlaylists(userUri.split(":")[2], 50, offset);
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

    return to.track(out.album, out);
  };

  const trackAlbum = async (uri: string) => {
    const a = await api();
    const out = await a.tracks.get(uri.split(":")[2]);

    return albumTracks(out.album.uri);
  };

  return {
    album,
    albumTracks,
    playlist,
    playlists,
    playlistAlbums,
    track,
    trackAlbum,
  };
};
