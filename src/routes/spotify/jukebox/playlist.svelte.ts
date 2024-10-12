import { API } from "$lib/spotify/api";
import { Album, AlbumTracks, PlaylistTracks, Track } from "$lib/types/music";

export const Playlist = (src: string) => {
  let album = $state(AlbumTracks);
  let albums = $state<AlbumTracks[]>([]);
  let history = $state<Track[]>([]);
  let playlist = $state(PlaylistTracks);
  let queue = $state<Track[]>([]);
  let shuffle = $state<Track[]>([]);
  let track = $state(Track);

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

    // FIXME
    queue = albums[0].tracks;
    shuffle = albums[1].tracks;
    history = albums[2].tracks;
  };

  return {
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

    get,
  };
};
