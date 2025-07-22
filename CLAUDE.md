# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with Vite
- `npm run dev -- --open` - Start dev server and open browser
- `npm install` - Install dependencies

### Build and Testing

- `npm run build` - Build production app
- `npm run preview` - Preview production build
- `npm test` - Run all tests (integration + unit)
- `npm run test:integration` - Run Playwright tests
- `npm run test:unit` - Run Vitest unit tests

### Code Quality

- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run type checking in watch mode
- `npm run lint` - Check formatting and linting (Prettier + ESLint)
- `npm run format` - Auto-format code with Prettier

### Database (Supabase)

- `supabase start` - Start local Supabase services
- `supabase status` - Check service status
- `supabase db reset` - Reset local database
- `supabase gen types --local > src/lib/types/database.ts` - Generate TypeScript types

## Architecture

### Technology Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS with DaisyUI components
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Audio**: Spotify Web API + Web Playback SDK for music streaming
- **Computer Vision**: TensorFlow.js for photobooth body segmentation
- **Storage**: Local storage with idb-keyval for caching

### Core Concepts

JukeLab is a jukebox-style music player that recreates the album-focused listening experience. The app supports multiple "skins" or interfaces:

1. **Desktop** (`/spotify/desktop`) - 2000s-style music player with trackpad navigation
2. **Keypad** (`/spotify/keypad`) - 90s jukebox with 100-CD collection and numeric keypad
3. **Remote** (`/spotify/remote`) - Mobile-friendly remote control interface
4. **Vinyl** (`/spotify/vinyl`) - Vinyl record player simulation

### Key Architecture Patterns

#### Music Data Model

- **Albums**: Core unit containing tracks, stored in `src/lib/types/music.ts`
- **Playlists**: User-curated collections that can contain multiple albums
- **Tracks**: Individual songs with full metadata (BPM, key, ISRC, etc.)
- **Compilations**: Special playlists marked as "JukeLab compilation" in Spotify

#### Spotify Integration

- API wrapper in `src/lib/spotify/api.ts` handles authentication and data fetching
- Transforms Spotify API responses to internal music types via `src/lib/spotify/to.ts`
- Caches album data in local storage to minimize API calls
- Rate limiting with 10ms delays to avoid Spotify limits

#### State Management

- Svelte 5 runes for reactive state
- `src/lib/supabase/broadcast.svelte.ts` for real-time multi-device synchronization
- Local storage via `src/lib/storage.ts` for persistent data

#### UI Themes & Effects

- Theme system in `src/lib/themes.ts` with holiday modes and visual effects
- Animation utilities in `src/lib/animations.ts` using GSAP
- Photobooth effects using TensorFlow.js body segmentation

### Project Structure

```
src/
├── lib/                     # Shared utilities and services
│   ├── spotify/            # Spotify API integration
│   ├── supabase/           # Database and real-time features
│   ├── types/              # TypeScript type definitions
│   └── *.ts                # Utility modules (auth, storage, etc.)
├── routes/                 # SvelteKit pages and components
│   ├── audio/              # Basic HTML audio player
│   ├── spotify/            # Main jukebox interfaces
│   │   ├── desktop/        # Desktop skin
│   │   ├── keypad/         # Keypad skin
│   │   ├── remote/         # Remote control
│   │   └── vinyl/          # Vinyl player
│   └── *.svelte            # Layout and shared components
supabase/                   # Database schema and functions
static/                     # Static assets (images, audio files)
```

### Environment Setup

Required environment variables in `.env`:

- `PUBLIC_SPOTIFY_TOKEN` - Development token (1hr expiry) from Spotify Web Playbook SDK docs
- `PUBLIC_SPOTIFY_CLIENT_ID` - Production client ID from Spotify app
- `PUBLIC_SUPABASE_URL` - Local: `http://127.0.0.1:54321`
- `PUBLIC_SUPABASE_ANON_KEY` - From `supabase status`

### Development Workflow

1. Start Supabase: `supabase start`
2. Install dependencies: `npm install`
3. Copy environment: `cp .env.example .env` and fill in Spotify credentials
4. Start development: `npm run dev -- --open`

### Testing

- Playwright for end-to-end testing of user interactions
- Vitest for unit testing utilities and business logic
- Type checking with `svelte-check` for compile-time validation
