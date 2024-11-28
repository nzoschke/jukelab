<div class="snow pointer-events-none fixed inset-0 z-50 h-screen w-screen">
  <div></div>
</div>

<style>
  .snow {
    background-image: url("/snow.svg");
    background-position: 0px 0px;
    animation: animatedBackground 8s linear infinite;
  }

  .snow div {
    width: 100%;
    height: 100%;
    background-image: url("/snow.svg");
    background-position: 0px 0px;
    animation: animatedBackground 12s linear infinite;
  }

  .snow::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,..."); /* Original SVG data URI */
    background-position: 0 0;
    animation: animatedBackground 8s linear infinite;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
  }

  @keyframes animatedBackground {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0px 300px;
    }
  }
</style>
