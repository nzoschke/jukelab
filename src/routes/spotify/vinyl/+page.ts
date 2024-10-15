import item from "$lib/playlist.json";
import { Playlist } from "../jukebox/playlist.svelte";
import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
  const playlist = Playlist("spotify:playlist:0JOnan9Ym7vJ485NEfdu5E");
  playlist.parse(JSON.stringify(item));

  return {
    srcs: playlist.albums.map((a) => a.art),
  };
};
