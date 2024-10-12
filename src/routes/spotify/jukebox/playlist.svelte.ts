import { API } from "$lib/spotify/api";
import { Album, AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";

export interface Src {
  albumSrc: string;
  trackSrc: string;
}

export interface AlbumTrack {
  albumNum: number;
  album: Album;
  trackNum: number;
  track: Track;
}

export const AlbumTrack: AlbumTrack = {
  albumNum: 0,
  album: Album,
  trackNum: 0,
  track: Track,
};

export const Playlist = (src: string) => {
  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let history = $state<Src[]>([]);
  let playlist = $state(PlaylistTracks);
  let queue = $state<Src[]>([]);
  let shuffle = $state<Src[]>([]);
  let track = $state(Track);

  const chunk = (size: number) =>
    albums.reduce<AlbumTracks[][]>((all, one, i) => {
      const ch = Math.floor(i / size);
      if (!all[ch]) all[ch] = [];
      all[ch].push(one);
      return all;
    }, []);

  const get = async () => {
    const api = API();
    playlist = await api.playlist(src);

    // get from cache if snapshot id matches
    const key = `${src}:${playlist.id}`;
    let i = localStorage.getItem(key);

    if (!i) {
      // clear cache for old snapshot id
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`${src}:`))
        .forEach((k) => localStorage.removeItem(k));

      for (const [i, t] of playlist.tracks.entries()) {
        albums.push(await api.trackAlbum(t.src));
        if (i == 0) {
          album = albums[0];
          track = album.tracks[0];
        }
      }

      i = JSON.stringify(albums);
      localStorage.setItem(key, i);
    }

    var re = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
    albums = JSON.parse(i, (k, v) => {
      if (typeof v == "string" && re.test(v)) {
        return new Date(v);
      }
      return v;
    });
    album = albums[0];
    track = album.tracks[0];

    _shuffle();
  };

  const push = (at: AlbumTrack) => {
    queue.push({ albumSrc: at.album.src, trackSrc: at.track.src });
  };

  // FIXME: history
  const shift = () => {};

  const skip = (delta: number) => {
    const tracks = albums.map((a) => a.tracks).flat();
    let n = tracks.findIndex((t) => t.src == track.src) + delta;
    if (n >= tracks.length) n = 0;
    if (n < 0) n = tracks.length - 1;

    track = tracks[n];
    album = albums.find((a) => a.tracks.includes(track))!;
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
    find,
    push,
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
