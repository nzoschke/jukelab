<script lang="ts">
  import { page } from "$app/stores";
  import logo from "$lib/images/jukelab.svg";
  import github from "$lib/images/github.svg";
  import { href, ishref } from "$lib/href";
  import { Bars3, Icon } from "svelte-hero-icons";
</script>

{#snippet tab(name: string, path: string)}
  <a role="tab" href={href(path)} class="tab" class:tab-active={ishref(path, $page.url)}>{name}</a>
{/snippet}

{#snippet menuItem(name: string, path: string)}
  <li>
    <a href={href(path)} class:active={ishref(path, $page.url)}>{name}</a>
  </li>
{/snippet}

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <!-- Mobile dropdown -->
    <div class="dropdown lg:hidden">
      <div tabindex="0" role="button" class="btn btn-circle btn-ghost">
        <Icon src={Bars3} class="size-5" />
      </div>
      <ul
        role="menu"
        tabindex="0"
        class="menu dropdown-content menu-sm z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {@render menuItem("Home", "/")}
        {@render menuItem("HTML Audio", "/audio")}
        {@render menuItem("Spotify", "/spotify")}
        {@render menuItem("Desktop", "/spotify/desktop")}
        {@render menuItem("Phone", "/spotify/phone")}
        {@render menuItem("Keypad", "/spotify/keypad")}
        {@render menuItem("About", "/about")}
      </ul>
    </div>
    <a class="hidden lg:block" href="https://jukelab.com">
      <img class="w-20" src={logo} alt="JukeLab logo" />
    </a>
  </div>
  <div class="navbar-center">
    <!-- Mobile: show logo centered -->
    <a class="lg:hidden" href="https://jukelab.com">
      <img class="w-20" src={logo} alt="JukeLab logo" />
    </a>
    <!-- Desktop: show tabs -->
    <div role="tablist" class="tabs-boxed tabs hidden lg:flex">
      {@render tab("Home", "/")}
      {@render tab("HTML Audio", "/audio")}
      {@render tab("Spotify", "/spotify")}
      {@render tab("Desktop", "/spotify/desktop")}
      {@render tab("Phone", "/spotify/phone")}
      {@render tab("Keypad", "/spotify/keypad")}
      {@render tab("About", "/about")}
    </div>
  </div>
  <div class="navbar-end">
    <a class="btn btn-circle btn-ghost" href="https://github.com/nzoschke/jukelab">
      <img src={github} alt="GitHub" />
    </a>
  </div>
</div>
