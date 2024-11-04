<script lang="ts">
  import { onMount } from "svelte";
  import { Auth } from "$lib/supabase/auth";

  const auth = Auth();
  let err = $state();

  onMount(async () => {
    err = await auth.exchange();
  });
</script>

{err}
