import { shuffle as arrayShuffle } from "$lib/array";
import { href } from "$lib/href";
import { normalizeAlbumTitle, normalizeTrackTitles } from "$lib/recordutil";
import { API } from "$lib/spotify/api";
import * as s from "$lib/storage";
import { pad } from "$lib/string";
import { Album, AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";
import { get as dbGet, set as dbSet } from "idb-keyval";

export type Lists = "queue" | "shuffle" | "history";

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
      ["JukeLab 101", "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E"],
      ["Jukelab 102", "spotify:playlist:3ENY9f8zKVYOegYWNJYAYV"],
    ],
  };

  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let history = $state<Src[]>([]);
  let playlist = $state(PlaylistTracks);
  let playlists: string[][] = $state([]);
  const progress = $state({ max: 0, value: 0 });
  let queue = $state<Src[]>([]);
  let shuffle = $state<Src[]>([]);
  let track = $state(Track);
  let photo = $state<string>();

  const playing = $derived.by(() => {
    const an = albums.indexOf(album);
    const tn = album.tracks.indexOf(track);
    return tn >= 0 ? `${pad(an)}${pad(tn + 1)}` : "____";
  });

  const enqueue = async (at: AlbumTrack, photo?: string) => {
    if (album?.src == at.album.src && track?.src == at.track.src) {
      return;
    }
    if (queue.find((q) => q.albumSrc == at.album.src && q.trackSrc == at.track.src)) {
      return;
    }
    queue.push({ albumSrc: at.album.src, trackSrc: at.track.src });
    if (photo) {
      dbSet(`${at.album.src}${at.track.src}`, photo);
    }
    s.set("queue", queue);
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

  // get gets a playlist and updates the cache with:
  // latest playlist src, list of recent playlists, and playlist contents by Spotify snapshot ID.
  // It reads the location hash so navigate to /page#playlist=spotify:playlist:id to load a new playlist
  const get = async (token: () => Promise<string>, onalbum?: (album: AlbumTracks) => void) => {
    let src = s.get("playlist", defaults["playlist"]);
    let text = "";

    const t = await token();
    if (!t) {
      src = "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E";
      playlist.title = "JukeLab 101";
      playlist.src = src;
      const res = await fetch(href("/playlist.json"));
      text = await res.text();
    } else {
      const api = API(token);
      playlist = await api.playlist(src);

      const key = `${src}:${playlist.id}`;
      albums = s.get(key, [] as AlbumTracks[]);
      if (albums.length == 0) {
        // clear cache for old snapshot id
        s.remPrefix(src);

        progress.max = playlist.tracks.length;
        await api.playlistAlbums(src, (a) => {
          const n = albums.push(a);
          progress.value = n;

          if (n == 1) {
            album = a;
            track = a.tracks[0];
            onalbum?.(a);
          }
        });

        s.set(key, albums);
      }

      text = JSON.stringify(albums);
    }

    // parse text into dates
    const re = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
    albums = JSON.parse(text, (k, v) => {
      if (typeof v == "string" && re.test(v)) {
        return new Date(v);
      }
      return v;
    });

    albums.forEach((a) => {
      a.title = normalizeAlbumTitle(a.title);
      const [newTitles, ok] = normalizeTrackTitles(a.tracks.map((t) => t.title));
      if (ok) {
        newTitles.forEach((t, i) => (a.tracks[i].title = t));
      }

      if (a.tracks.length > 1 && a.tracks[0].artist !== a.tracks[1].artist) {
        a.tracks.forEach((t) => (t.title = `${t.title} by ${t.artist}`));
      }
    });

    // if playlist changed clear queue
    if (!s.check("playlist", src)) {
      s.set("history", []);
      s.set("queue", []);
      s.set("shuffle", []);
    }

    // update storage
    playlists = s.get("playlists", defaults["playlists"]);
    const n = playlists.findIndex((p) => p[1] == src);
    n >= 0 ? (playlists[n][0] = playlist.title) : playlists.push([playlist.title, src]);
    s.set("playlist", src);
    s.set("playlists", playlists);

    // update queue
    history = s.get("history", []);
    queue = s.get("queue", []);
    shuffle = s.get("shuffle", []);

    if (shuffle.length == 0) reshuffle();

    const at = history.length ? find(history[0]) : find(shuffle[0]);
    album = at.album;
    onalbum?.(album);
    track = at.track;
  };

  const play = async (src: Src | undefined) => {
    if (!src) return;

    history.unshift(src);

    s.set("history", history);
    s.set("queue", queue);
    s.set("shuffle", shuffle);

    const at = find(src);
    album = at.album;
    track = at.track;
    photo = await dbGet(`${at.album.src}${at.track.src}`);

    return src;
  };

  const listClear = (key: Lists) => {
    s.rem(key);
    if (key == "history") history = [];
    else if (key == "queue") queue = [];
    else if (key == "shuffle") reshuffle();
  };

  const listMove = (key: string, src: Src, delta: number) => {
    let l: Src[];
    if (key == "queue") l = queue;
    else if (key == "shuffle") l = shuffle;
    else return;

    const i = l.indexOf(src);
    if (i == -1) return;

    if (delta === -Infinity) {
      l.splice(i, 1);
      s.set(key, l);
      return;
    }

    const n = i + delta;
    if (n < 0 || n >= l.length) return;

    l.splice(i, 1);
    l.splice(n, 0, src);
    s.set(key, l);
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

  const reshuffle = () => {
    const srcs = albums.map((a) => a.tracks.map((t) => _src(a, t))).flat();
    shuffle = arrayShuffle(srcs);
    s.set("shuffle", shuffle);
  };

  const _src = (a: Album, t: Track): Src => ({ albumSrc: a.src, trackSrc: t.src });

  return {
    enqueue,
    find,
    get,
    listClear,
    listMove,
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
    get nowPlayingImage() {
      return photo || album.art;
    },
  };
};
