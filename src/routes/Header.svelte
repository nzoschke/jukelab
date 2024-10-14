<script lang="ts">
  import { page } from "$app/stores";
  import logo from "$lib/images/jukelab.svg";
  import github from "$lib/images/github.svg";
  import { href, ishref } from "$lib/href";
</script>

{#snippet tab(name: string, path: string)}
  <a role="tab" href={href(path)} class="tab" class:tab-active={ishref(path, $page.url)}>{name}</a>
{/snippet}

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <a class="" href="https://jukelab.com">
      <img class="w-20" src={href(logo)} alt="JukeLab logo" />
    </a>
  </div>
  <div class="navbar-center">
    <div role="tablist" class="tabs-boxed tabs">
      {@render tab("Home", "/")}
      {@render tab("HTML Audio", "/audio")}
      {@render tab("Spotify", "/spotify")}
      {@render tab("Jukebox", "/spotify/jukebox")}
      {@render tab("About", "/about")}
    </div>
  </div>
  <div class="navbar-end">
    <a class="btn btn-circle btn-ghost" href="https://github.com/nzoschke/jukelab">
      <img src={href(github)} alt="GitHub" />
    </a>
  </div>
</div>
