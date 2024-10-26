export const Storage = () => {
  let playlist = "";
  let playlists: string[][] = $state([]);

  const _get = (key: string, def: any) => {
    const i = localStorage.getItem(key);
    return i ? JSON.parse(i) : def;
  };

  const get = () => {
    playlist = _get("playlist", "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E");
    playlists = _get("playlists", [
      ["Jukelab 101", "spotify:playlist:0JOnan9Ym7vJ485NEfdu5E"],
      ["Jukelab 102", "spotify:playlist:3ENY9f8zKVYOegYWNJYAYV"],
    ]);
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

  return {
    get,
    hash,
    set,

    get playlist() {
      return playlist;
    },
    set playlist(v: string) {
      playlist = v;
    },
    get playlists() {
      return playlists;
    },
  };
};
