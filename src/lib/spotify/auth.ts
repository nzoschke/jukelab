import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "$env/dynamic/public";
import { dev } from "$app/environment";

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
    if (clientId()) {
      const t = await api.getAccessToken();
      return t?.access_token || "";
    }

    const t = await devToken();
    return t || "";

    // const t = await api.getAccessToken();
    // return t?.access_token || "";
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

const clientId = () => {
  const { PUBLIC_SPOTIFY_CLIENT_ID: id } = env;
  if (id && id.length == 32) return id;
};

const devToken = async () => {
  const { PUBLIC_SPOTIFY_TOKEN: token } = env;
  if (!token) return;

  const api = SpotifyApi.withAccessToken("", {
    access_token: token,
    token_type: "",
    expires_in: 3600,
    refresh_token: "",
  });

  try {
    await api.currentUser.profile();
    return token;
  } catch (e) {
    return "";
  }
};

// validate tokens. undefined means no error
export const validate = async (): Promise<string | undefined> => {
  if (!dev) return;
  if (clientId()) return;
  if (await devToken()) return;

  if (env.PUBLIC_SPOTIFY_CLIENT_ID) {
    return "Bad PUBLIC_SPOTIFY_CLIENT_ID. See README.md";
  }

  if (env.PUBLIC_SPOTIFY_TOKEN) {
    return "Bad or expired token PUBLIC_SPOTIFY_TOKEN. See README.md";
  }

  return "Missing PUBLIC_SPOTIFY_TOKEN and PUBLIC_SPOTIFY_CLIENT_ID. See README.md";
};
