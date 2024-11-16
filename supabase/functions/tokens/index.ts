import { encodeBase64 } from "jsr:@std/encoding/base64";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const client = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  const token = req.headers.get("Authorization").replace("Bearer ", "");
  const {
    data: { user },
  } = await client.auth.getUser(token);

  const { data } = await client.from("tokens").select("*").eq("user_id", user.id).single();

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodeBase64(`${Deno.env.get("PUBLIC_SPOTIFY_CLIENT_ID")}:${Deno.env.get("SPOTIFY_CLIENT_SECRET")}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: data.token,
    }),
  });
  const text = await res.text();
  return new Response(text, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
