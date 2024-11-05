<script lang="ts">
  import { IUser } from "$lib/auth";
  import { Auth } from "$lib/supabase/auth";
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import { onMount } from "svelte";
  import { Backward, Forward, Icon, Pause, Play } from "svelte-hero-icons";

  const auth = Auth();
  const bc = Broadcast();
  let user = $state(IUser);
  let paused = $state(false);
  let player = $derived(bc.presence.values().find((v) => v.name == "player"));

  onMount(async () => {
    if (!(await auth.token())) return;
    user = await auth.user();
    bc.sub(user.channel, "remote", (msg) => {
      if (msg.type == "pause") {
        paused = msg.payload.paused;
      }
    });
  });
</script>

<div class="flex items-center">
  <button
    class="btn btn-circle btn-md"
    class:btn-disabled={!player}
    onclick={() => {
      bc.pub(user.channel, { type: "skip", payload: { delta: -1 } });
    }}
  >
    <Icon
      src={Backward}
      solid
      class="size-6"
      aria-hidden="false"
      aria-label="previous"
      role="img"
    />
  </button>

  <button
    class="btn btn-circle btn-primary"
    class:btn-disabled={!player}
    onclick={() => {}}
    aria-label="playPause"
  >
    {#if paused}
      <Icon src={Play} solid class="size-6" aria-hidden="false" aria-label="play" role="img" />
    {:else}
      <Icon src={Pause} solid class="size-6" aria-hidden="false" aria-label="pause" role="img" />
    {/if}
  </button>

  <button
    class="btn btn-circle"
    class:btn-disabled={!player}
    onclick={() => {
      bc.pub(user.channel, { type: "skip", payload: { delta: +1 } });
    }}
  >
    <Icon src={Forward} solid class="size-6" aria-hidden="false" aria-label="next" role="img" />
  </button>
</div>

{#if user.channel}
  <button
    class="btn"
    onclick={() => {
      bc.pub(user.channel, { type: "skip", payload: {} });
    }}>Skip</button
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

{#each bc.messages as msg}
  <p>{JSON.stringify(msg)}</p>
{/each}

{#each bc.presence as [k, v]}
  <p>{k}: {v.name}</p>
{/each}
