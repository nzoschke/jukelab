<script>
  import Header from "./Header.svelte";
</script>

<svelte:head>
  <title>JukeLab - Your Digital Jukebox</title>
  <meta name="description" content="Bring an old-school jukebox to your next party with JukeLab" />
</svelte:head>

<div class="bg-gradient-to-b from-base-100 to-base-200">
  <Header />

  <!-- Hero Section -->
  <div class="hero py-16">
    <div class="hero-content text-center">
      <div class="max-w-4xl">
        <h1 class="mb-6 text-6xl font-bold text-primary">JukeLab</h1>
        <p class="mb-8 text-xl text-base-content/80">
          Bring an old-school jukebox to your next party. Curate a playlist of 100 albums, set up a
          dedicated device, then let your friends control the music all night.
        </p>
        <a href="http://localhost:5173/spotify/desktop" class="btn btn-primary btn-lg px-8 text-lg">
          Launch JukeLab
        </a>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="px-4 py-16">
    <div class="mx-auto max-w-6xl">
      <h2 class="mb-12 text-center text-4xl font-bold">Features</h2>

      <div class="grid justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Desktop Player -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center">
            <div class="mb-4 text-4xl">🖥️</div>
            <h3 class="card-title">Desktop Player</h3>
            <p class="text-sm">
              2000s-style music player with trackpad navigation and visual album browsing
            </p>
          </div>
        </div>

        <!-- Keypad Jukebox -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center">
            <div class="mb-4 text-4xl">🎵</div>
            <h3 class="card-title">Keypad Jukebox</h3>
            <p class="text-sm">
              90s-style jukebox with 100-CD collection controlled by numeric keypad
            </p>
          </div>
        </div>

        <!-- Vinyl Player -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center">
            <div class="mb-4 text-4xl">💿</div>
            <h3 class="card-title">Vinyl Player</h3>
            <p class="text-sm">Authentic vinyl record player simulation with spinning animations</p>
          </div>
        </div>

        <!-- Spotify Integration -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center">
            <div class="mb-4 text-4xl">🎧</div>
            <h3 class="card-title">Spotify Powered</h3>
            <p class="text-sm">Full integration with Spotify's catalog and Web Playback SDK</p>
          </div>
        </div>

        <!-- Photobooth -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center">
            <div class="mb-4 text-4xl">📸</div>
            <h3 class="card-title">Photobooth</h3>
            <p class="text-sm">AI-powered photo effects and body segmentation for party fun</p>
          </div>
        </div>

        <!-- Themes -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center">
            <div class="mb-4 text-4xl">🎨</div>
            <h3 class="card-title">Holiday Themes</h3>
            <p class="text-sm">Seasonal themes and visual effects to match any occasion</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Call to Action -->
  <div class="bg-primary py-16 text-primary-content">
    <div class="text-center">
      <h2 class="mb-4 text-3xl font-bold">Ready to Party?</h2>
      <p class="mb-8 text-lg opacity-90">Set up your jukebox and let the music play</p>
      <a href="http://localhost:5173/spotify/desktop" class="btn btn-secondary btn-lg">
        Get Started
      </a>
    </div>
  </div>
</div>
