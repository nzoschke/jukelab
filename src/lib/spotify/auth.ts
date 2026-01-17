import { dev } from "$app/environment";
import * as env from "$env/static/public";
import { IUser, type IAuth } from "$lib/auth";
import { href } from "$lib/href";
import * as s from "$lib/storage";
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

    const k = "spotify:href";
    const h = s.get(k, href("/spotify/desktop"));
    s.rem(k);
    window.location.href = h;
  };

  const login = async (path: string) => {
    s.set("spotify:href", href(path));

    await api.authenticate();
  };

  const logout = async () => {
    api.logOut();
    window.location.reload();
  };

  // token is the current access token. "" implies not authenticated
  const token = async () => {
    const t = await api.getAccessToken();
    return t?.access_token || "";
  };

  // user is the current user. Empty ID means unauthenticated
  const user = async () => {
    const t = await api.getAccessToken();
    if (!t) return IUser;

    const p = await api.currentUser.profile();
    return {
      email: p.email,
      id: p.id,
      image: p.images[0]?.url || "",
      name: p.display_name || "",
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

// get dev token using client credentials flow (Node.js only, for tests)
// returns undefined if not in dev, "" if failed, otherwise the access token
export const devToken = async () => {
  if (!dev) return;

  // client credentials flow only works in Node.js (tests)
  if (typeof process === "undefined" || !process.env) return;

  const id = clientId();
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return;

  try {
    const api = SpotifyApi.withClientCredentials(id, secret);
    // Make an API call to trigger token fetch (SDK is lazy)
    await api.albums.get("4aawyAB9vmqN3uQ7FjRGTy");
    const t = await api.getAccessToken();
    return t?.access_token || "";
  } catch {
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

  return "Missing PUBLIC_SPOTIFY_CLIENT_ID. See README.md";
};
