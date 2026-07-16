# CitySignal
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)

CitySignal is a local-first developer-event discovery experience, launched for Hyderabad. It unifies events from platforms and community calendars, then helps builders find relevant events without browsing every global organizer page.

## Current prototype

The first version is a dependency-free static app. It includes an interactive Hyderabad event feed, natural-language-style discovery, source/topic/date filters, event detail views, and saved events. Demo data lives at the top of `app.js`, keeping the UI separate from future source adapters.

For the complete AI version, deploy to Vercel and add `OPENAI_API_KEY` in Project Settings → Environment Variables. The browser calls `/api/ai-search`; the key stays server-side. Without the key, the UI remains fully usable and falls back to local smart matching.

## Next integration steps

1. Add source adapters for Luma, Meetup, Eventbrite, and approved Hyderabad community calendars. `data/sources.json` is the reviewed source registry; only ingest listings where the platform/organizer permits access.
2. Normalize source records into the event model in `app.js`.
3. Use the OpenAI Responses API server-side for event extraction, Hyderabad locality validation, topic classification, duplicate detection, and semantic search.
4. Schedule refreshes and retain a reviewed fallback cache for a reliable demo.

## Demo narrative

Search “GenAI workshops this weekend,” filter to in-person events, open a result, and show that the source link preserves the original organizer listing.

## Run locally

Static preview (no AI required):

```bash
# from project root
npm install
npm start
# open http://localhost:3000
```

Enable AI locally / test serverless function:

- Add your `OPENAI_API_KEY` to Vercel Project Settings → Environment Variables, or run `vercel dev` and provide a `.env.local` file with the key. See `.env.example` for variable names.
- To run the full stack locally with Vercel's local runtime:

```bash
# install Vercel CLI if you don't have it
npm i -g vercel
vercel dev
```

Notes:
- The app safely falls back to local matching if the AI function is unavailable.
- Do not commit secrets; keep keys in Vercel settings or a local `.env.local` ignored by git.
