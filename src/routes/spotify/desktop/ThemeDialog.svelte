<script lang="ts">
  import { themes } from "$lib/themes";

  let {
    open = $bindable(),
    theme = $bindable(),
  }: {
    open: boolean;
    theme: string;
  } = $props();

  let modal: HTMLDialogElement | null = null;

  $effect(() => {
    if (open) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  });
</script>

{#if open}
  <dialog bind:this={modal} onclose={() => (open = false)} class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold">Themes</h3>

      <div class="my-4 flex flex-wrap gap-4">
        {#each themes.filter((t) => !t.hidden) as t}
          <button class="flex w-20 flex-col items-center" onclick={() => (theme = t.name)}>
            <img
              src="https://assets.getpartiful.com/backgrounds/{t.name}/thumbnail.png"
              alt={t.name}
              class="h-20 w-20 rounded-full border-8 border-solid object-cover"
              class:border-primary={t.name === theme}
              class:border-transparent={t.name !== theme}
            />
          </button>
        {/each}
      </div>

      <p>
        Themes from <a href="https://partiful.com/" target="_blank" class="link text-primary"
          >Partiful</a
        >.
      </p>
    </div>
  </dialog>
{/if}
