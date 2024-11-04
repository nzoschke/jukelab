<script lang="ts">
  import { IUser } from "$lib/auth";
  import { Auth } from "$lib/supabase/auth";
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import type { User } from "@supabase/supabase-js";
  import { onMount } from "svelte";

  // FIXME: share supabase client between Auth and Broadcast
  const auth = Auth();
  const bc = Broadcast("room1");
  let token = $state<string>();
  let user = $state(IUser);

  onMount(async () => {
    token = await auth.token();
    if (!token) return;
    user;
    user = await auth.user();
    bc.sub();
  });
</script>

{#each bc.messages as msg}
  <p>{JSON.stringify(msg)}</p>
{/each}

{#each bc.presence as [k, v]}
  <p>{k}: {v.name}</p>
{/each}

{#if token}
  <button
    class="btn"
    onclick={() => {
      bc.pub({ type: "hi", payload: { src: "page" } });
    }}>Pub</button
  >
  <button
    class="btn"
    onclick={() => {
      auth.logout();
    }}
    >Sign out {user.email} {user.channel}
  </button>
  <img src={user.image} alt="user" />
{:else}
  <button
    class="btn"
    onclick={() => {
      auth.login("/spotify/remote");
    }}>Sign in</button
  >
{/if}
