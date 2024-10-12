import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "$env/dynamic/public";

export const Auth = () => {
  const api = SpotifyApi.withUserAuthorization(
    env.PUBLIC_SPOTIFY_CLIENT_ID,
    `${env.PUBLIC_ORIGIN}/spotify/callback`,
    [
      "app-remote-control",
      "streaming",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "user-read-email",
      "user-read-playback-state",
      "user-read-private",
    ],
  );

  const exchange = async () => {
    return api.authenticate();
  };

  const login = async (href: string) => {
    localStorage.setItem("spotify-sdk:href", new URL(href, env.PUBLIC_ORIGIN).href);
    return api.authenticate();
  };

  const logout = () => {
    api.logOut();
    window.location.reload();
  };

  // profile is the current user. undefined implies not authenticated
  const profile = async () => {
    const t = await api.getAccessToken();
    return t ? api.currentUser.profile() : undefined;
  };

  const redirect = () => {
    const k = "spotify-sdk:href";
    const href = localStorage.getItem(k) || new URL("/spotify", env.PUBLIC_ORIGIN).href;
    localStorage.removeItem(k);
    window.location.href = href;
  };

  // token is the current access token. "" implies not authenticated
  const token = async () => {
    const t = await api.getAccessToken();
    return t?.access_token || "";
  };

  return {
    exchange,
    login,
    logout,
    profile,
    redirect,
    token,
  };
};
