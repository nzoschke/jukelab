<script lang="ts">
    import { Broadcast } from "$lib/supabase/broadcast.svelte";
    import { onMount } from "svelte";

  const bc = Broadcast("room1");

  onMount(() => {
    bc.sub()
  })
</script>

{#each bc.messages as msg}
  <p>{JSON.stringify(msg)}</p>
{/each}

{#each bc.presence as [k,v]}
  <p>{k}: {v.name}</p>
{/each}

<button onclick={() => {bc.pub({ type: "hi", payload: { src: "page" } })}}>Pub</button>