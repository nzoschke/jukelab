<script lang="ts">
  import { onMount } from "svelte";
  import { Auth } from "$lib/supabase/auth";

  onMount(async () => {
    const auth = Auth();
    await auth.exchange();
    auth.redirect();
  });
</script>
