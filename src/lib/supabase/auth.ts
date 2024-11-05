import * as env from "$env/static/public";
import { type IAuth, IUser } from "$lib/auth";
import { href } from "$lib/href";
import { pad } from "$lib/string";
import type { Database } from "$lib/types/database";
import { createClient } from "@supabase/supabase-js";

export const client = createClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

export const Auth = (): IAuth => {
  // exchange stores an access and refresh token. If successful it redirects, otherwise it returns an error string
  const exchange = async () => {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return "auth user not found";

    const err = await getChannel(user.id);
    if (err) return err;

    const k = "supabase:href";
    const h = localStorage.getItem(k) || href("/supabase");
    localStorage.removeItem(k);
    window.location.href = h;
  };

  const getChannel = async (userId: string) => {
    const { count, error } = await client
      .from("channels")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (error) return error.message;

    if (count == 0) {
      const { error } = await client
        .from("channels")
        .insert({ channel: channel(), user_id: userId });
      if (error) return error.message;
    }
  };

  const login = async (path: string) => {
    localStorage.setItem("supabase:href", href(path));
    await client.auth.signInWithOAuth({
      options: {
        redirectTo: `${env.PUBLIC_ORIGIN}/auth/callback`,
      },
      provider: "spotify",
    });
  };

  const logout = async () => {
    await client.auth.signOut();
    window.location.reload();
  };

  // token is the current access token. "" implies not authenticated
  const token = async () => {
    const {
      data: { session },
    } = await client.auth.getSession();
    return session?.access_token || "";
  };

  // user is the current user. Empty ID means unauthenticated
  const user = async (): Promise<IUser> => {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return IUser;

    const { data } = await client
      .from("channels")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    return {
      channel: data?.channel || "",
      email: user.email || "",
      id: user.id,
      image: user.user_metadata["picture"],
      name: user.user_metadata["name"],
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

const channel = () => {
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const n = Math.floor(Math.random() * 10);
  return `${adj}-${noun}-${pad(n, 2)}`;
};

const adjs = [
  "acoustic",
  "alternative",
  "ambient",
  "blues",
  "classical",
  "country",
  "disco",
  "downtempo",
  "dub",
  "dubstep",
  "electronic",
  "folk",
  "funk",
  "garage",
  "grunge",
  "hiphop",
  "house",
  "indie",
  "jazz",
  "kpop",
  "lofi",
  "metal",
  "opera",
  "pop",
  "punk",
  "rap",
  "reggae",
  "rock",
  "soul",
  "swing",
  "techno",
  "trance",
  "trap",
  "triphop",
];

const nouns = [
  "aardvark",
  "alligator",
  "anteater",
  "ant",
  "armadillo",
  "bat",
  "bear",
  "bee",
  "bison",
  "buffalo",
  "butterfly",
  "camel",
  "centipede",
  "chameleon",
  "cheetah",
  "chimp",
  "chipmunk",
  "crab",
  "cricket",
  "crocodile",
  "deer",
  "dolphin",
  "duck",
  "eagle",
  "elephant",
  "falcon",
  "flamingo",
  "fly",
  "fox",
  "frog",
  "gecko",
  "giraffe",
  "goose",
  "gorilla",
  "hamster",
  "hawk",
  "hedgehog",
  "hippo",
  "hornet",
  "horse",
  "iguana",
  "jellyfish",
  "kangaroo",
  "koala",
  "ladybug",
  "leopard",
  "lion",
  "lizard",
  "lobster",
  "millipede",
  "moose",
  "mosquito",
  "mouse",
  "newt",
  "octopus",
  "opossum",
  "orangutan",
  "ostrich",
  "otter",
  "owl",
  "panda",
  "parrot",
  "peacock",
  "pelican",
  "penguin",
  "porcupine",
  "rabbit",
  "raccoon",
  "rat",
  "rhino",
  "scorpion",
  "seahorse",
  "seal",
  "shark",
  "sheep",
  "shrimp",
  "skunk",
  "sloth",
  "snail",
  "snake",
  "spider",
  "squid",
  "squirrel",
  "starfish",
  "swan",
  "tiger",
  "toad",
  "tortoise",
  "trout",
  "turtle",
  "walrus",
  "wasp",
  "whale",
  "wolf",
  "zebra",
];
