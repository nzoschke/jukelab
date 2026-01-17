<script lang="ts">
  import { IUser } from "$lib/auth";
  import { Auth } from "$lib/supabase/auth";
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import { Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import { Backward, Forward, Icon, Pause, Play } from "svelte-hero-icons";
  import Avatar from "../Avatar.svelte";

  const auth = Auth();
  const bc = Broadcast();

  let art = $state("");
  let paused = $state(false);
  let player = $derived(Array.from(bc.presence.values()).find((v) => v.name == "player"));
  let track = $state(Track);
  let user = $state(IUser);

  onMount(async () => {
    if (!(await auth.token())) return;

    user = await auth.user();
    bc.sub(user.channel, "remote", (msg) => {
      if (msg.type == "art") {
        art = msg.payload.art;
      }
      if (msg.type == "pause") {
        paused = msg.payload.paused;
      }
      if (msg.type == "track") {
        track = msg.payload;
        track.year = new Date(track.year);
      }
    });
  });
</script>

<div class="flex h-svh flex-col border">
  <div class="navbar bg-base-100">
    <div class="navbar-center flex h-16 w-full flex-col justify-center rounded border">
      <div class="w-full text-center">
        {#if track.src != ""}
          <p class="truncate">{track.title}</p>
          <p class="truncate">
            {track.album}
            {track.year.getTime() == 0 ? "" : `(${track.year.getFullYear()})`}
          </p>
        {:else}
          <p>JukeLab Remote</p>
          <p>Login and start a player to connect</p>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex flex-grow justify-end overflow-scroll">
    {#if art != ""}
      <div class="avatar w-full p-2">
        <img src={art} alt="art" />
      </div>
    {/if}
  </div>

  {@render footer()}
</div>

{#snippet footer()}
  <!-- component layout -->
  <div class="navbar relative min-h-20 bg-base-100 p-0">
    <div class="navbar-start w-32 p-2"></div>
    <div class="navbar-center flex grow justify-center">
      {@render center()}
    </div>
    <div class="navbar-end w-32 p-2">
      {@render end()}
    </div>
  </div>

  {#snippet center()}
    <button
      class="btn btn-circle"
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
      class="btn btn-circle btn-primary btn-lg"
      class:btn-disabled={!player}
      onclick={() => {
        bc.pub(user.channel, { type: "pause", payload: { paused: !paused } });
      }}
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
  {/snippet}

  {#snippet end()}
    <Avatar path="/spotify/remote" />
  {/snippet}
{/snippet}
