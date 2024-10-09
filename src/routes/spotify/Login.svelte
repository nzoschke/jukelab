<script lang="ts">
  import type { UserProfile } from "@spotify/web-api-ts-sdk";
  import { onMount } from "svelte";
  import { Auth } from "./auth";

  let {
    href = "",
  }: {
    href: string;
  } = $props();

  const auth = Auth();

  let profile = $state<UserProfile>();
  let token = $state<string>();

  onMount(async () => {
    token = await auth.token();
    if (token == "") return;

    profile = await auth.profile();
  });
</script>

<button
  class="btn btn-primary btn-sm"
  class:hidden={!profile}
  onclick={() => {
    auth.logout();
  }}>Log Out {profile?.display_name}</button
>

<button
  class="btn btn-primary btn-sm"
  class:hidden={token != ""}
  onclick={async () => {
    await auth.login(href);
  }}>Log In</button
>
