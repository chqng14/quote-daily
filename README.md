# Quote Daily

An art-directed, single-page quote reader inspired by the restraint and typography of [impeccable.style](https://impeccable.style/).

## Features

- English quote as the primary reading layer
- Small translated line below it
- Translation language persisted in `localStorage`
- Random quote button
- Topic filters: life, love, wisdom, courage, humor
- Goodreads attribution links on seeded quotes
- Responsive layout and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Quote data

The current MVP uses a small, manually curated local dataset in `src/quotes.ts`.

Goodreads is used as a discovery/reference source, but the app does **not** scrape Goodreads at runtime. Goodreads' Terms of Use restrict automated data extraction, so a production catalog should use content you have permission to store, a licensed API/data source, or a manual editorial import workflow.

The data layer is intentionally simple so it can later be replaced by a database/API without changing the reading experience.
