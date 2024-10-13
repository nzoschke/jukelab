# JukeLab

JukeLab brings an old-school jukebox to your next party. Curate a jukebox playlist full of 100 albums, set up a dedicated device, then let your friends control the music all night.

![JukeLab Screenshot](static/jukebox.png?raw=true)

Visit [jukelab.com](https://jukelab.com/jukebox) to try out the app in your web browser, or [visit the Apple App Store](https://apps.apple.com/app/id1480787158) to try it on your iPad or iPhone.

Under the hood it is a web app built on top of [HTML Audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) and [Spotify for developers](https://developer.spotify.com/).

## Why JukeLab?

We recall the times when artists composed albums, fans wore out records, friends crafted mix CDs, and nerds skinned music apps.

JukeLab brings back a music experience that you curate and customize.

## Developing

JukeLab is built on TypeScript and Svelte.

On Mac we recommend [Homebrew](https://brew.sh/) to install development tools:

```bash
brew install git node

git clone https://github.com/nzoschke/jukelab.git
cd jukelab

# fill in PUBLIC_SPOTIFY_TOKEN
cp .env.example .env

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

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
