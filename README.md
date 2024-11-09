# JukeLab

JukeLab brings an old-school jukebox to your next party. Curate a jukebox playlist full of 100 albums, set up a dedicated device, then let your friends control the music all night.

![JukeLab Screenshot](static/jukebox.png?raw=true)

Visit [nzoschke.github.io/jukelab/](https://nzoschke.github.io/jukelab/) to try the development version in your web browser. [Visit jukelab.com](https://jukelab.com) or the [Apple App Store](https://apps.apple.com/app/id1480787158) get the real version for web or iOS (Android coming soon).

JukeLab is a web app built on [HTML Audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) and [Spotify for Developers](https://developer.spotify.com/) with [SvelteKit](https://kit.svelte.dev/).

## Motivation

We recall the times when artists composed albums, fans wore out records, friends crafted mix CDs, and nerds skinned music apps.

JukeLab brings back a similar music experience that you can curate and customize.

## Developing

JukeLab is built on TypeScript and Svelte 5.

On Mac we recommend [Homebrew](https://brew.sh/) to install development tools:

```bash
brew install git node

git clone https://github.com/nzoschke/jukelab.git
cd jukelab

# fill in PUBLIC_SPOTIFY_TOKEN
cp .env.example .env

supabase start

npm install
npm run dev -- --open
```

### Spotify

To get a development Spotify access token that works for 1 hour, go to the [Getting Started with Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started) doc, log into Spotify, click "Reveal your access token", then set it in `.env`:

```bash
PUBLIC_SPOTIFY_TOKEN=<TOKEN>
```

![Dev Token](static/token.png?raw=true)

To make a "prod" Spotify app that works indefinitely, go to [Getting started with Web API
](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) doc, follow the "Create an app" section, get your client ID, then set it in `.env`:

```bash
PUBLIC_SPOTIFY_CLIENT_ID=<CLIENT_ID>
```

### Supabase

```bash
supabase init
supabase start
supabase status

# create new migration
supabase migration new create_channels_table

# then browse to http://127.0.0.1:54323, use table editor, then generate diff
supabase db diff --schema public > supabase/migrations/20241104092543_create_channels_table.sql

# generate types
supabase gen types --local > src/lib/types/database.ts
# copy / paste to POTO db.ts
quicktype --framework kotlinx --lang kotlin --package vizlab src/lib/types/db.ts > app/src/main/kotlin/vizlab/Db.kt

# reset data
supabase db reset
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
