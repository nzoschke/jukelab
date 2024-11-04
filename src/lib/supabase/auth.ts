import * as env from "$env/static/public";
import { href } from "$lib/href";
import { createClient } from "@supabase/supabase-js";

export const Auth = () => {
  const client = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

  const exchange = async () => {
    await client.auth.getUser();
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
    var { data, error } = await client.auth.getUser();
    return data.user || undefined;
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
