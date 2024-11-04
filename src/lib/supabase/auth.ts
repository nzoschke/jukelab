import * as env from "$env/static/public";
import { href } from "$lib/href";
import { pad } from "$lib/string";
import type { Database } from "$lib/types/database";
import { createClient } from "@supabase/supabase-js";

export const Auth = () => {
  const client = createClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

  const exchange = async () => {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return;
    if (
      (
        await client
          .from("channels")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
      ).count == 1
    )
      return;
    await client.from("channels").insert({ channel: channel(), user_id: user.id });
  };

  const login = async (path: string) => {
    localStorage.setItem("supabase:href", href(path));
    await client.auth.signInWithOAuth({
      options: {
        redirectTo: `${env.PUBLIC_ORIGIN}/supabase/callback`,
      },
      provider: "spotify",
    });
  };

  const logout = () => {
    client.auth.signOut();
    window.location.reload();
  };

  // profile is the current user. undefined implies not authenticated
  const profile = async () => {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return undefined;

    const row = await client.from("channels").select("*").eq("user_id", user.id).limit(1).single();
    user.user_metadata["channel"] = row.data?.channel;

    return user;
  };

  const redirect = () => {
    const k = "supabase:href";
    const h = localStorage.getItem(k) || href("/supabase");
    localStorage.removeItem(k);
    window.location.href = h;
  };

  // token is the current access token. "" implies not authenticated
  const token = async () => {
    const {
      data: { session },
      error,
    } = await client.auth.getSession();
    return session?.access_token || "";
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

const channel = () => {
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const n = Math.floor(Math.random() * 10);
  return `${adj}-${noun}-${pad(n, 2)}`;
};

const adjs = [
  "acid",
  "ambient",
  "balearic",
  "berlin",
  "booty",
  "breakbeat",
  "breakcore",
  "chicago",
  "chiptune",
  "darkwave",
  "detroit",
  "downtempo",
  "disco",
  "dnb",
  "dub",
  "dubstep",
  "ebm",
  "electro",
  "freestyle",
  "gabber",
  "garage",
  "ghetto",
  "goa",
  "glitch",
  "hardstyle",
  "house",
  "hyperpop",
  "ibiza",
  "idm",
  "indie",
  "industrial",
  "italo",
  "jungle",
  "juke",
  "leftfield",
  "lounge",
  "minimal",
  "progressive",
  "psytrance",
  "synthwave",
  "techno",
  "trance",
  "trap",
  "uk",
  "vaporwave",
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
