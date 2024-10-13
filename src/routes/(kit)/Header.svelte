<script>
  import { page } from "$app/stores";
  import logo from "$lib/images/jukelab.svg";
  import github from "$lib/images/github.svg";
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <a class="" href="https://jukelab.com">
      <img class="w-20" src={logo} alt="JukeLab logo" />
    </a>
  </div>
  <div class="navbar-center">
    <div role="tablist" class="tabs-boxed tabs">
      <a role="tab" href="/" class="tab" class:tab-active={$page.url.pathname === "/"}>Home</a>
      <a role="tab" href="/about" class="tab" class:tab-active={$page.url.pathname === "/about"}
        >About</a
      >
      <a role="tab" href="/spotify" class="tab" class:tab-active={$page.url.pathname === "/spotify"}
        >Spotify</a
      >
    </div>
  </div>
  <div class="navbar-end">
    <a class="btn btn-circle btn-ghost" href="https://github.com/nzoschke/jukelab">
      <img src={github} alt="GitHub" />
    </a>
  </div>
</div>

<style>
</style>
