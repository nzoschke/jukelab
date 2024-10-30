<script lang="ts">
  import { Auth } from "$lib/spotify/auth";
  import type { UserProfile } from "@spotify/web-api-ts-sdk";
  import { onMount } from "svelte";

  const auth = Auth();
  let profile = $state<UserProfile>();
  let token = $state<string>();

  onMount(async () => {
    token = await auth.token();
    if (!token) return;
    profile = await auth.profile();
  });
</script>

{#if profile}
  <div class="group relative flex">
    <button
      class="avatar size-12 group-hover:opacity-0"
      onclick={async () => {
        auth.logout();
      }}
    >
      <div class="rounded-full">
        <img alt="" src={profile.images[0].url} />
      </div>
    </button>
    <button
      class="btn btn-circle btn-ghost absolute opacity-0 group-hover:opacity-100"
      onclick={async () => {
        auth.logout();
      }}
    >
      Logout
    </button>
  </div>
{:else}
  <button
    class="btn btn-circle btn-ghost"
    class:hidden={token != ""}
    onclick={async () => {
      await auth.login("/spotify/desktop");
    }}
  >
    Login
  </button>
{/if}
