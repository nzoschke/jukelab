import * as env from "$env/static/public";
import { Auth as SpotifyAuth } from "$lib/spotify/auth";
import { Auth as SupabaseAuth } from "$lib/supabase/auth";

export interface IUser {
  channel: string;
  email: string;
  id: string;
  image: string;
  name: string;
}

export interface IAuth {
  exchange: () => Promise<string | undefined>;
  login: (path: string) => Promise<void>;
  logout: () => Promise<void>;
  token: () => Promise<string>;
  user: () => Promise<IUser>;
}

export const IUser: IUser = {
  channel: "",
  email: "",
  id: "",
  image: "",
  name: "",
};

export const Auth = (): IAuth => {
  if (env.PUBLIC_SUPABASE_URL) return SupabaseAuth();
  if (env.PUBLIC_SPOTIFY_CLIENT_ID) return SpotifyAuth();

  return {
    exchange: async () => "unimplemented",
    login: async (_path: string) => {},
    logout: async () => {},
    token: async () => "",
    user: async () => IUser,
  };
};
