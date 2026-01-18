<script lang="ts">
  import { Playlist, type Src, type Lists } from "./playlist.svelte";
  import { ChevronDown, ChevronUp, XMark, Icon } from "svelte-hero-icons";

  let {
    hidden = false,
    playlist,
    class: className = "w-80",
  }: {
    hidden: boolean;
    playlist: ReturnType<typeof Playlist>;
    class?: string;
  } = $props();

  let active = $state<Lists>("queue");
</script>

<div class="flex flex-col overflow-hidden bg-base-300 p-1 {className}" class:hidden>
  <div role="tablist" class="tabs-boxed tabs shrink-0 justify-center">
    {@render tab("queue")}
    {@render tab("history")}
  </div>
  <div class="flex-1 overflow-y-auto">
    <div class:hidden={active != "queue"}>
      <div class="flex justify-between">
        <button class="btn btn-ghost btn-sm pointer-events-none">Hand picked</button>
        <button
          class="btn btn-ghost btn-sm w-16"
          disabled={playlist.queue.length == 0}
          onclick={() => {
            playlist.listClear("queue");
          }}>Clear</button
        >
      </div>
      {@render list(playlist.queue, "queue")}
      <div class="flex justify-between">
        <button class="btn btn-ghost btn-sm pointer-events-none">Random luck</button>
        <button
          class="btn btn-ghost btn-sm w-16"
          onclick={() => {
            playlist.listClear("shuffle");
          }}>Reroll</button
        >
      </div>
      {@render list(playlist.shuffle.slice(0, 10), "shuffle")}
    </div>
    <div class:hidden={active != "history"}>
      <div class="flex justify-between">
        <button class="btn btn-ghost btn-sm pointer-events-none">Recently enjoyed</button>
        <button
          class="btn btn-ghost btn-sm w-16"
          disabled={playlist.history.length == 0}
          onclick={() => {
            playlist.listClear("history");
          }}>Clear</button
        >
      </div>
      {@render list(playlist.history)}
    </div>
  </div>
</div>

{#snippet tab(list: Lists)}
  <button
    role="tab"
    class="tab w-20"
    class:tab-active={active == list}
    onclick={() => {
      active = list;
    }}>{list.toUpperCase()}</button
  >
{/snippet}

{#snippet list(srcs: Src[], list?: Lists)}
  {#each srcs as src}
    {@const { album, track } = playlist.find(src)}
    <div class="group relative flex items-center space-x-1 pt-1">
      <img class="h-12 w-12" src={album.art} alt="art" />
      {#if list}
        <div class="absolute -left-1 flex h-12 w-12 flex-col opacity-0 group-hover:opacity-90">
          <button
            class="btn btn-xs h-4 min-h-4 rounded-none"
            onclick={() => {
              playlist.listMove(list, src, -1);
            }}
          >
            <Icon src={ChevronUp} class="size-4" />
          </button>
          <button
            class="btn btn-xs h-4 min-h-4 rounded-none"
            onclick={() => {
              playlist.listMove(list, src, -Infinity);
            }}
          >
            <Icon src={XMark} class="size-4" />
          </button>
          <button
            class="btn btn-xs h-4 min-h-4 rounded-none"
            onclick={() => {
              playlist.listMove(list, src, +1);
            }}
          >
            <Icon src={ChevronDown} class="size-4" />
          </button>
        </div>
      {/if}
      <div class="flex flex-col overflow-hidden">
        <div class="truncate font-bold">{track.title}</div>
        <div class="truncate">{track.artist}</div>
      </div>
    </div>
  {/each}
{/snippet}
