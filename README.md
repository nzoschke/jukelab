# JukeLab

JukeLab brings an old-school jukebox to your next party. Curate a jukebox playlist full of 100 albums, set up a dedicated device, then let your friends control the music all night.

Visit [jukelab.com](https://jukelab.com/jukebox) to try out the app in your web browser, or [visit the Apple App Store](https://apps.apple.com/app/id1480787158) to try it on your iPad or iPhone.

Under the hood it is a web app built on top of [Spotify for developers](https://developer.spotify.com/).

Read on to learn how to develop the app to further customize your experience.

## Why JukeLab?

We look back to a simpler time when artists crafted albums, fans bought records, friends made mix CDs, and nerds customized their music apps.

## Developing

On Mac we recommend [Homebrew](https://brew.sh/) to install development tools

```bash
brew install git node
git clone https://github.com/nzoschke/jukelab.git
cd jukelab
npm install
npm run dev
open http://localhost:5173/spotify/jukebox
```

### Spotify

To get a dev Spotify access token that works for 1 hour, go to the [Getting Started with Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started) doc, click "Reveal your access token", then set it in `.env`:

```bash
PUBLIC_SPOTIFY_TOKEN=<TOKEN>
```

To make a Spotify app that works indefinitely, go to [Getting started with Web API
](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) doc, follow the "Create an app" section, get your client ID, then set it in `.env`:

```bash
PUBLIC_SPOTIFY_CLIENT_ID=<CLIENT_ID>
```

```bash
# install dependencies
npm install

# start dev server
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
