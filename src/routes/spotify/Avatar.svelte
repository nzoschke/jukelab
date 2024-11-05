<script lang="ts">
  import { Auth, IUser } from "$lib/auth";
  import { onMount } from "svelte";

  const auth = Auth();
  let user = $state(IUser);
  let token = $state<string>();

  onMount(async () => {
    token = await auth.token();
    if (!token) return;
    user = await auth.user();
  });
</script>

{#if user.id}
  <div class="group relative flex">
    <button
      class="avatar size-12 group-hover:opacity-0"
      onclick={async () => {
        auth.logout();
      }}
    >
      <div class="rounded-full">
        <img alt="" src={user.image} />
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
