import type { Playlist } from "$lib/types/music";

export const Storage = () => {
  const defaults: Record<string, any> = {
    playlist: "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E",
    playlists: [
      ["Jukelab 101", "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E"],
      ["Jukelab 102", "spotify:playlist:3ENY9f8zKVYOegYWNJYAYV"],
    ],
  };
  let playlist = "";
  let playlists: string[][] = $state([]);

  const _get = (key: string) => {
    const i = localStorage.getItem(key);
    return i ? JSON.parse(i) : defaults[key];
  };

  const get = () => {
    playlist = _get("playlist");
    playlists = _get("playlists");
  };

  const getItem = (key: string) => {
    return hash()[key] || _get(key);
  };

  const hash = () => {
    var hash = window.location.hash.substring(1);
    var params: Record<string, string> = {};
    hash.split("&").map((hk) => {
      let parts = hk.split("=");
      params[parts[0]] = parts[1];
    });

    return params;
  };

  const set = () => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
    localStorage.setItem("playlists", JSON.stringify(playlists));
  };

  const setPlaylist = (pl: Playlist) => {
    playlist = pl.src;
    // playlists.indexOf((p) => p[1] == pl.src)
    const i = playlists.findIndex((p) => p[1] == pl.src);
    if (i >= 0) {
      playlists[i][0] = pl.title;
    } else {
      playlists.push([pl.title, pl.src]);
    }

    set();
  };

  return {
    get,
    getItem,
    setPlaylist,

    get playlist() {
      return playlist;
    },
    set playlist(v: string) {
      playlist = v;
    },
    get playlists() {
      return playlists;
    },
    set playlists(v: string[][]) {
      playlists = v;
    },
  };
};
