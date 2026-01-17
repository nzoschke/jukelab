import { Auth as SpotifyAuth } from "$lib/spotify/auth";

export interface IUser {
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
  email: "",
  id: "",
  image: "",
  name: "",
};

export const Auth = (): IAuth => SpotifyAuth();
