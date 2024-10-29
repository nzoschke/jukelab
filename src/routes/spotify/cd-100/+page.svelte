<script lang="ts">
  import {
    Bars3,
    ChevronLeft,
    ChevronRight,
    CommandLine,
    Icon,
    QueueList,
    XMark,
    Sun,
  } from "svelte-hero-icons";

  const onkeydown = (e: KeyboardEvent) => {};
</script>

<svelte:window {onkeydown} />

<svelte:head>
  <title>CD-100</title>
  <meta name="description" content="CD-100 Jukebox" />
</svelte:head>

<!-- page layout -->
<div class="drawer">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <div class="flex h-screen w-screen flex-col">
      {@render nav()}

      <div class="flex flex-grow justify-end overflow-scroll">
        <div class="flex w-full flex-col overflow-scroll">
          {@render main()}
        </div>
        {@render aside()}
      </div>

      {@render footer()}
      {@render details()}
    </div>
  </div>
  <div class="drawer-side">
    <label for="drawer" aria-label="close menu" class="drawer-overlay"></label>
    {@render menu()}
  </div>
</div>

<!-- page components -->
{#snippet menu()}
  <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">menu</ul>
{/snippet}

{#snippet nav()}
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

  {#snippet start()}
    <label for="drawer" class="btn btn-circle btn-ghost">
      <Icon src={Bars3} class="size-5" />
    </label>
  {/snippet}

  {#snippet center()}
    center
  {/snippet}

  {#snippet end()}
    end
  {/snippet}
{/snippet}

{#snippet main()}
  main
{/snippet}

{#snippet aside()}
  aside
{/snippet}

{#snippet footer()}
  <div class="h-12">footer</div>
{/snippet}

{#snippet details()}
  <div class="h-12">details</div>
{/snippet}
