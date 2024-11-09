<script lang="ts">
  import { Auth, IUser } from "$lib/auth";
  import { onMount } from "svelte";

  let {
    href = "",
  }: {
    href: string;
  } = $props();

  const auth = Auth();

  let user = $state(IUser);
  let token = $state<string>();

  onMount(async () => {
    token = await auth.token();
    if (token == "") return;
    user = await auth.user();
  });
</script>

<button
  class="btn btn-primary btn-sm"
  class:hidden={!user}
  onclick={() => {
    auth.logout();
  }}>Log Out {user.name}</button
>

<button
  class="btn btn-primary btn-sm"
  class:hidden={token != ""}
  onclick={async () => {
    await auth.login(href);
  }}>Log In</button
>
