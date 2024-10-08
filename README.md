# JukeLab

JukeLab is a DIY jukebox.

## Developing

### Spotify

To get a dev Spotify access token that works for 1 hour, go to the [Getting Started with Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started) doc, click "Reveal your access token", then set it in `.env`:

```bash
PUBLIC_SPOTIFY_TOKEN=<TOKEN>
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
