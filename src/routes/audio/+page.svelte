<script>
  import Audio from "./Audio.svelte";
</script>

<svelte:head>
  <title>Audio Source</title>
  <meta name="description" content="Audio source" />
</svelte:head>

<section class="flex flex-col justify-center items-center flex-[0.6]">
  <Audio class="w-full" controls loop src="/steps.mp3" />
</section>
