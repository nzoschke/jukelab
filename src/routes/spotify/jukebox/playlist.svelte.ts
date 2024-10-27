import { API } from "$lib/spotify/api";
import { Album, AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
import * as s from "./storage";

export interface Src {
  albumSrc: string;
  trackSrc: string;
}

export interface AlbumTrack {
  albumNum: number;
  album: AlbumTracks;
  trackNum: number;
  track: Track;
}

export const AlbumTrack: AlbumTrack = {
  albumNum: 0,
  album: AlbumTracks,
  trackNum: 0,
  track: Track,
};

export const Playlist = () => {
  const defaults = {
    playlist: "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E",
    playlists: [
      ["Jukelab 101", "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E"],
      ["Jukelab 102", "spotify:playlist:3ENY9f8zKVYOegYWNJYAYV"],
    ],
  };

  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let history = $state<Src[]>([]);
  let playlist = $state(PlaylistTracks);
  let playlists: string[][] = $state([]);
  let progress = $state({ max: 0, value: 0 });
  let queue = $state<Src[]>([]);
  let shuffle = $state<Src[]>([]);
  let track = $state(Track);

  let playing = $derived.by(() => {
    const an = albums.indexOf(album);
    const tn = album.tracks.indexOf(track);
    return tn > 0 ? `${pad(an)}${pad(tn + 1)}` : "____";
  });

  const pad = (n: number) => n.toString().padStart(2, "0");

  const chunk = (size: number) =>
    albums.reduce<AlbumTracks[][]>((all, one, i) => {
      const ch = Math.floor(i / size);
      if (!all[ch]) all[ch] = [];
      all[ch].push(one);
      return all;
    }, []);

  // get gets a playlist and updates the cache with:
  // latest playlist src, list of recent playlists, and playlist contents by Spotify snapshot ID.
  // It reads the location hash so navigate to /page#playlist=spotify:playlist:id to load a new playlist
  const get = async (token: () => Promise<string>) => {
    const api = API(token);

    const src = s.get("playlist", defaults["playlist"]);
    playlist = await api.playlist(src);

    // update storage
    playlists = s.get("playlists", defaults["playlists"]);
    const n = playlists.findIndex((p) => p[1] == src);
    n >= 0 ? (playlists[n][0] = playlist.title) : playlists.push([playlist.title, src]);
    s.set("playlist", src);
    s.set("playlists", playlists);

    progress.max = playlist.tracks.length;

    // get from cache if snapshot id matches
    const key = `${src}:${playlist.id}`;
    let i = localStorage.getItem(key);

    if (!i) {
      // clear cache for old snapshot id
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`${src}:`))
        .forEach((k) => localStorage.removeItem(k));

      await api.tracksAlbums(playlist.tracks, (a) => {
        const n = albums.push(a);
        progress.value = n;
        if (n == 1) {
          album = albums[0];
          track = album.tracks[0];
        }
      });

      i = JSON.stringify(albums);
      localStorage.setItem(key, i);
    }

    progress.value = progress.max;

    return parse(i);
  };

  const parse = (json: string): AlbumTracks[] => {
    var re = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
    albums = JSON.parse(json, (k, v) => {
      if (typeof v == "string" && re.test(v)) {
        return new Date(v);
      }
      return v;
    });

    history = JSON.parse(localStorage.getItem("jukelab:history") || "[]");
    queue = JSON.parse(localStorage.getItem("jukelab:queue") || "[]");

    _shuffle();

    const at = history.length ? find(history[0]) : find(shuffle[0]);
    album = at.album;
    track = at.track;

    return albums;
  };

  const play = async (src: Src | undefined) => {
    if (!src) return;

    history.unshift(src);

    localStorage.setItem("jukelab:history", JSON.stringify(history));
    localStorage.setItem("jukelab:queue", JSON.stringify(queue));

    const at = find(src);
    album = at.album;
    track = at.track;

    return src;
  };

  const enqueue = async (at: AlbumTrack) => {
    queue.push({ albumSrc: at.album.src, trackSrc: at.track.src });
    localStorage.setItem("jukelab:queue", JSON.stringify(queue));
  };

  const shift = async (): Promise<Src | undefined> => {
    const src = queue.length > 0 ? queue.shift() : shuffle.shift();
    return play(src);
  };

  const unshift = async (): Promise<Src | undefined> => {
    return play(history[1]);
  };

  const skip = async (delta: number) => {
    if (delta == +1) return await shift();
    if (delta == -1) return await unshift();
  };

  const find = (src: Src): AlbumTrack => {
    const albumNum = albums.findIndex((a) => a.src == src.albumSrc);
    const album = albums[albumNum];
    const trackNum = album.tracks.findIndex((t) => t.src == src.trackSrc);
    const track = album.tracks[trackNum];

    return {
      albumNum,
      album,
      track,
      trackNum,
    };
  };

  const _src = (a: Album, t: Track): Src => ({ albumSrc: a.src, trackSrc: t.src });

  const _shuffle = () => {
    if (shuffle.length > 0) return;

    const srcs = albums.map((a) => a.tracks.map((t) => _src(a, t))).flat();
    let i = srcs.length;
    while (i != 0) {
      const ri = Math.floor(Math.random() * i);
      i--;
      [srcs[i], srcs[ri]] = [srcs[ri]!, srcs[i]!];
    }

    shuffle = srcs;
  };

  return {
    get,
    chunk,
    enqueue,
    find,
    parse,
    skip,

    get album() {
      return album;
    },
    set album(v: AlbumTracks) {
      album = v;
    },

    get albums() {
      return albums;
    },
    get history() {
      return history;
    },
    get playlist() {
      return playlist;
    },
    get playlists() {
      return playlists;
    },
    get playing() {
      return playing;
    },
    get progress() {
      return progress;
    },
    get queue() {
      return queue;
    },
    get shuffle() {
      return shuffle;
    },
    get track() {
      return track;
    },
    set track(v: Track) {
      track = v;
    },
  };
};
