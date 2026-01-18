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

npm install
npx playwright install

# fill in PUBLIC_SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET and run tests
cp .env.example .env
npm test

npm install
npm run dev -- --open
```

### Mobile Testing

To test on a mobile device (iPhone/Android), run with `--host` to expose on your local network:

```bash
npm run dev -- --host
```

For iOS Safari, HTTPS is required for Spotify authentication (the Web Crypto API needs a secure context). Use the `HTTPS` flag:

```bash
HTTPS=true npm run dev -- --host
```

Then visit `https://<your-ip>:8090` on your phone (accept the self-signed certificate warning).

### Spotify

To make a Spotify app that works indefinitely, go to [Getting started with Web API
](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) doc, follow the "Create an app" section, get your client credentials, then set it in `.env`:

```bash
PUBLIC_SPOTIFY_CLIENT_ID=<CLIENT_ID>
SPOTIFY_CLIENT_SECRET=<CLIENT_SECRET>
```

Note that only the client ID is public, the secret is only for local testing.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
