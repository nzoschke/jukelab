<script lang="ts">
  import { anim, getAnimations } from "$lib/animations";
  import { getThemes, theme } from "$lib/themes";

  let {
    open = $bindable(),
  }: {
    open: boolean;
  } = $props();

  let activeTab = $state("themes");

  // svelte-ignore non_reactive_update
  let modal: HTMLDialogElement | null = null;

  $effect(() => {
    if (open) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  });

  const themes = getThemes();
  const animations = getAnimations();

  const onClickRandomize = () => {
    $theme = themes[Math.floor(Math.random() * themes.length)].name;
    $anim = animations[Math.floor(Math.random() * animations.length)].name;
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
        <button class="btn btn-primary btn-sm rounded-full" onclick={onClickRandomize}>
          Randomize!
        </button>
      </div>

      <div class="my-4 flex max-h-80 flex-wrap gap-4 overflow-y-auto">
        {#if activeTab === "themes"}
          {#each themes as t}
            <button class="flex w-20 flex-col items-center" onclick={() => ($theme = t.name)}>
              {#if t.img}
                <img
                  src={t.img}
                  alt={t.name}
                  class="w-20 rounded-full border-8 border-solid object-cover"
                  class:border-primary={t.name === $theme}
                  class:border-transparent={t.name !== $theme}
                />
              {:else}
                <div class="avatar placeholder">
                  <div
                    class="w-20 rounded-full border-8 border-solid bg-neutral text-neutral-content"
                    class:border-primary={t.name === $theme}
                    class:border-transparent={t.name !== $theme}
                  >
                    <span class="text-1xl">{t.avatar}</span>
                  </div>
                </div>
              {/if}
            </button>
          {/each}
        {/if}

        {#if activeTab === "effects"}
          {#each animations as a}
            <button class="flex w-20 flex-col items-center" onclick={() => ($anim = a.name)}>
              {#if a.img}
                <img
                  src={`https://assets.getpartiful.com/animations/${a.name}/thumbnail.png`}
                  alt={a.name}
                  class="h-20 w-20 rounded-full border-8 border-solid object-cover"
                  class:border-primary={a.name === $anim}
                  class:border-transparent={a.name !== $anim}
                />
              {:else}
                <div class="avatar placeholder">
                  <div
                    class="w-20 rounded-full border-8 border-solid bg-neutral text-neutral-content"
                    class:border-primary={a.name === $anim}
                    class:border-transparent={a.name !== $anim}
                  >
                    <span class="text-1xl">{a.avatar}</span>
                  </div>
                </div>
              {/if}
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
