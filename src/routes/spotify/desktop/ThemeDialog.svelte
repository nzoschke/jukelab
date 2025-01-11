<script lang="ts">
  import { animations } from "$lib/animations";
  import { themes } from "$lib/themes";

  let {
    open = $bindable(),
    theme = $bindable(),
    anim = $bindable(),
  }: {
    open: boolean;
    theme: string;
    anim: string;
  } = $props();

  let activeTab = $state("themes");
  let modal: HTMLDialogElement | null = null;

  $effect(() => {
    if (open) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  });

  const onClickRandomize = () => {
    theme = themes[Math.floor(Math.random() * themes.length)].name;
    anim = animations[Math.floor(Math.random() * animations.length)].name;
  };
</script>

{#if open}
  <dialog bind:this={modal} onclose={() => (open = false)} class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <div class="mb-4 flex items-center justify-between">
        <div role="tablist" class="tabs tabs-bordered inline-flex">
          <button
            class="tab font-bold"
            class:tab-active={activeTab === "themes"}
            onclick={() => (activeTab = "themes")}
          >
            Theme
          </button>
          <button
            class="tab font-bold"
            class:tab-active={activeTab === "effects"}
            onclick={() => (activeTab = "effects")}
          >
            Effects
          </button>
        </div>
        <button class="btn btn-circle btn-primary btn-sm" onclick={onClickRandomize}>
          <img src="/dice.svg" alt="randomize" class="h-6 w-6 rounded" />
        </button>
      </div>

      <div class="my-4 flex max-h-80 flex-wrap gap-4 overflow-y-auto">
        {#if activeTab === "themes"}
          {#each themes.filter((t) => !t.hidden) as t}
            <button class="flex w-20 flex-col items-center" onclick={() => (theme = t.name)}>
              <img
                src={`https://assets.getpartiful.com/backgrounds/${t.name}/thumbnail.png`}
                alt={t.name}
                class="h-20 w-20 rounded-full border-8 border-solid object-cover"
                class:border-primary={t.name === theme}
                class:border-transparent={t.name !== theme}
              />
            </button>
          {/each}
        {/if}

        {#if activeTab === "effects"}
          {#each animations.filter((a) => !a.hidden) as a}
            <button class="flex w-20 flex-col items-center" onclick={() => (anim = a.name)}>
              <img
                src={`https://assets.getpartiful.com/animations/${a.name}/thumbnail.png`}
                alt={a.name}
                class="h-20 w-20 rounded-full border-8 border-solid object-cover"
                class:border-primary={a.name === anim}
                class:border-transparent={a.name !== anim}
              />
            </button>
          {/each}
        {/if}
      </div>

      <p>
        Styles from <a href="https://partiful.com/" target="_blank" class="link text-primary"
          >Partiful</a
        >.
      </p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
{/if}
