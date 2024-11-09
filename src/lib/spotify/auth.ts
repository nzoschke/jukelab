import { dev } from "$app/environment";
import * as env from "$env/static/public";
import { IUser, type IAuth } from "$lib/auth";
import { href } from "$lib/href";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const Auth = (): IAuth => {
  const api = SpotifyApi.withUserAuthorization(
    env.PUBLIC_SPOTIFY_CLIENT_ID,
    `${env.PUBLIC_ORIGIN}/auth/callback`,
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

  // exchange stores an access and refresh token. If successful it redirects, otherwise it returns an error string
  const exchange = async () => {
    const res = await api.authenticate();
    if (!res.authenticated) return "auth user not found?";

    const k = "spotify-sdk:href";
    const h = localStorage.getItem(k) || href("/spotify");
    localStorage.removeItem(k);
    window.location.href = h;
  };

  const login = async (path: string) => {
    localStorage.setItem("spotify-sdk:href", href(path));
    await api.authenticate();
  };

  const logout = async () => {
    api.logOut();
    window.location.reload();
  };

  // token is the current access token. "" implies not authenticated
  const token = async () => {
    if (clientId()) {
      const t = await api.getAccessToken();
      return t?.access_token || "";
    }

    const t = await devToken();
    return t || "";
  };

  // user is the current user. Empty ID means unauthenticated
  const user = async () => {
    const t = await api.getAccessToken();
    if (!t) return IUser;

    const p = await api.currentUser.profile();
    return {
      channel: "",
      email: p.email,
      id: p.id,
      image: p.images[0].url,
      name: p.display_name,
    };
  };

  return {
    exchange,
    login,
    logout,
    token,
    user,
  };
};

// get prod client ID. undefined means unset, "" means invalid, otherwise the client ID is returned
const clientId = () => {
  const { PUBLIC_SPOTIFY_CLIENT_ID: id } = env;
  if (!id) return;
  if (id.length != 32) return "";
  return id;
};

// get dev token. undefined means unset, "" means invalid, otherwise the valid token is returned
export const devToken = async () => {
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

// validate tokens. undefined means no error, otherwise an error message is returned
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
