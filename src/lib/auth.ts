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
