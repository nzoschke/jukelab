<script lang="ts">
  import { IUser } from "$lib/auth";
  import { Auth } from "$lib/supabase/auth";
  import { Broadcast } from "$lib/supabase/broadcast.svelte";
  import { Track } from "$lib/types/music";
  import { onMount } from "svelte";
  import { Backward, Forward, Icon, Pause, Play, Signal } from "svelte-hero-icons";
  import Avatar from "../Avatar.svelte";

  const auth = Auth();
  const bc = Broadcast();

  let art = $state("");
  let paused = $state(false);
  let player = $derived(bc.presence.values().find((v) => v.name == "player"));
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

<div class="flex flex-col">
  {@render nav()}

  <div class="flex flex-grow justify-end overflow-scroll">
    <div class="flex w-full flex-col overflow-scroll">
      {@render main()}
    </div>
  </div>

  {@render footer()}
</div>

{#snippet nav()}
  <!-- component layout -->
  <div class="navbar min-h-20 bg-base-100 p-0">
    <div class="navbar-start w-32 p-2">
      {@render start()}
    </div>
    <div class="navbar-center flex grow justify-center">
      {@render center()}
    </div>
    <div class="navbar-end w-32 p-2">
      {@render end()}
    </div>
  </div>

  <!-- section layouts -->
  {#snippet start()}
    <Icon src={Signal} class="size-5" />
  {/snippet}

  {#snippet center()}
    <div class="flex size-full space-x-2 rounded border bg-base-200 md:w-[32rem]">
      <div class="avatar size-16">
        <div class="rounded">
          {#if art != ""}
            <img class="size-full" src={art} alt="" />
          {/if}
        </div>
      </div>
      <div class="flex grow flex-col items-center justify-center overflow-hidden">
        <div class="w-full overflow-hidden text-center">
          <p class="truncate">{track.title}</p>
          <p class="truncate">
            {track.album}
            {track.year.getTime() == 0 ? "" : `(${track.year.getFullYear()})`}
          </p>
        </div>
      </div>
      <div class="size-16 min-w-16"></div>
    </div>
  {/snippet}

  {#snippet end()}
    <Avatar path="/spotify/remote" />
  {/snippet}
{/snippet}

{#snippet main()}
  <div class="flex h-full flex-col items-center justify-center">
    <p>{user.channel}</p>
  </div>
{/snippet}

{#snippet footer()}
  <!-- component layout -->
  <div class="navbar relative min-h-20 bg-base-100 p-0">
    <div class="navbar-start w-32 p-2"></div>
    <div class="navbar-center flex grow justify-center">
      {@render center()}
    </div>
    <div class="navbar-end w-32 p-2"></div>
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
  {/snippet}
{/snippet}
