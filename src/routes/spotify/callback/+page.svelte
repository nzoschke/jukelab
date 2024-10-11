<script lang="ts">
  import { onMount } from "svelte";
  import { Auth } from "$lib/spotify/auth";

  onMount(async () => {
    const auth = Auth();
    await auth.exchange();
    auth.redirect();
  });
</script>
