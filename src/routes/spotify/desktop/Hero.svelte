<script lang="ts">
  import { fade } from "svelte/transition";

  let {
    visible = $bindable(false),
  }: {
    visible: boolean;
  } = $props();
</script>

{#if visible}
  <div class="hero absolute left-0 top-0 min-h-screen bg-base-200" in:fade out:fade>
    <div class="hero-content flex-col lg:flex-row">
      <img
        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        class="max-w-sm rounded-lg shadow-2xl"
        alt="hi"
      />
      <div>
        <h1 class="text-5xl font-bold">Box Office News!</h1>
        <p class="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
          exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <button class="btn btn-primary" onclick={() => (visible = false)}>Get Started</button>
      </div>
    </div>
  </div>
{/if}
