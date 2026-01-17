<script>
  import { href } from "$lib/href";
  import Header from "../Header.svelte";
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" content="About JukeLab" />
</svelte:head>

<div class="flex w-full flex-col items-center space-y-8">
  <Header />

  <div class="flex w-full max-w-2xl flex-col items-center space-y-8">
    <h1 class="text-5xl font-bold">About JukeLab</h1>

    <div class="prose">
      <p>
        This is a collection of functional and customizable music apps and an educational <a
          href="https://kit.svelte.dev">SvelteKit</a
        > app. You can start to hack on it by:
      </p>

      <pre>git clone https://github.com/nzoschke/jukelab.git</pre>

      <p>
        The <a href={href("/spotify/desktop")}>desktop</a> page illustrates music player that works like
        an old-school jukebox. To curate a music vibe it only allows a limited number of albums. To keep
        things simple it only allows you to add a song to the end of the queue.
      </p>
    </div>
  </div>
</div>
