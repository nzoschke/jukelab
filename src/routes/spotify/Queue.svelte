<script lang="ts">
  import { Playlist, type Src } from "./playlist.svelte";

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
  <div role="tablist" class="tabs-boxed tabs">
    {@render tab("queue")}
    {@render tab("shuffle")}
    {@render tab("history")}
  </div>
  <div class="overflow-scroll">
    {@render list("queue", playlist.queue)}
    {@render list("shuffle", playlist.shuffle.slice(0, 20))}
    {@render list("history", playlist.history)}
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

{#snippet list(tab: Tabs, srcs: Src[])}
  {#each srcs as src}
    {@const { album, track } = playlist.find(src)}
    <div class="flex items-center space-x-1 pt-1" class:hidden={active != tab}>
      <img class="h-12 w-12" src={album.art} alt="art" />
      <div class="flex flex-col overflow-hidden">
        <div class="truncate font-bold">{track.title}</div>
        <div class="truncate">{track.artist}</div>
      </div>
    </div>
  {/each}
{/snippet}
