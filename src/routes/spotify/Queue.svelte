<script lang="ts">
  import { Playlist, type Src } from "./playlist.svelte";
  import * as s from "./storage";
  import { ChevronDown, ChevronUp, XMark, Icon } from "svelte-hero-icons";

  type Tabs = "queue" | "shuffle" | "history";

  let {
    hidden = false,
    playlist,
  }: {
    hidden: boolean;
    playlist: ReturnType<typeof Playlist>;
  } = $props();

  let active = $state<Tabs>("queue");
</script>

<div class="flex w-80 flex-col overflow-hidden bg-base-300 p-1" class:hidden>
  <div role="tablist" class="tabs-boxed tabs justify-center">
    {@render tab("queue")}
    {@render tab("history")}
  </div>
  <div class="overflow-scroll">
    <div class:hidden={active != "queue"}>
      <div class="flex justify-between">
        <button class="btn btn-ghost btn-sm pointer-events-none">Selected</button>
        <button
          class="btn btn-ghost btn-sm w-16"
          disabled={playlist.queue.length == 0}
          onclick={() => {
            playlist.remQueue();
          }}>Clear</button
        >
      </div>
      {@render list(playlist.queue)}
      <div class="flex justify-between">
        <button class="btn btn-ghost btn-sm pointer-events-none">From shuffle</button>
        <button
          class="btn btn-ghost btn-sm w-16"
          onclick={() => {
            playlist.reshuffle();
          }}>Reroll</button
        >
      </div>
      {@render list(playlist.shuffle.slice(0, 10))}
    </div>
    <div class:hidden={active != "history"}>
      <div class="flex justify-between">
        <button class="btn btn-ghost btn-sm pointer-events-none">Recently played</button>
        <button
          class="btn btn-ghost btn-sm w-16"
          disabled={playlist.history.length == 0}
          onclick={() => {
            playlist.remHistory();
          }}>Clear</button
        >
      </div>
      {@render list(playlist.history)}
    </div>
  </div>
</div>

{#snippet tab(tab: Tabs)}
  <button
    role="tab"
    class="tab w-20"
    class:tab-active={active == tab}
    onclick={() => {
      active = tab;
    }}>{tab.toUpperCase()}</button
  >
{/snippet}

{#snippet list(srcs: Src[])}
  {#each srcs as src}
    {@const { album, track } = playlist.find(src)}
    <div class="group relative flex items-center space-x-1 pt-1">
      <img class="h-12 w-12" src={album.art} alt="art" />
      <div class="absolute -left-1 flex h-12 w-12 flex-col opacity-0 group-hover:opacity-60">
        <button
          class="btn btn-xs h-4 min-h-4 rounded-none"
          onclick={() => {
            playlist.queueMove(src, -1);
          }}
        >
          <Icon src={ChevronUp} class="size-4" />
        </button>
        <button
          class="btn btn-xs h-4 min-h-4 rounded-none"
          onclick={() => {
            playlist.queueSplice(src);
          }}
        >
          <Icon src={XMark} class="size-4" />
        </button>
        <button
          class="btn btn-xs h-4 min-h-4 rounded-none"
          onclick={() => {
            playlist.queueMove(src, +1);
          }}
        >
          <Icon src={ChevronDown} class="size-4" />
        </button>
      </div>
      <div class="flex flex-col overflow-hidden">
        <div class="truncate font-bold">{track.title}</div>
        <div class="truncate">{track.artist}</div>
      </div>
    </div>
  {/each}
{/snippet}
