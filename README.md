# Quote Daily

Quote Daily is an art-directed quote reader where each topic behaves like a different gallery room. The UI uses procedural CSS artwork rather than copied paintings: Life leans post-impressionist, Love is Art Nouveau, Wisdom uses ink/ukiyo-e restraint, Courage is expressionist, and Humor borrows from graphic modernism.

## What is integrated

The Netlify quote function normalizes multiple sources behind one endpoint and automatically falls back when a provider is missing a key, rate-limited, or unavailable:

- API Ninjas — daily + random + category filtering when `API_NINJAS_KEY` is configured
- They Said So — public QOD; random/search when `THEYSAIDSO_API_KEY` is configured
- ZenQuotes — daily/random fallback
- FavQs — public QOTD; tag/random selection when `FAVQS_TOKEN` is configured
- Quotable — random/tag fallback
- Local curated collection — final offline fallback

The browser calls only `/.netlify/functions/quote`, so provider keys never ship in the Vite bundle.

## Translation

Quotes are always shown in English first. The smaller translation line supports Vietnamese, French, Spanish, and Japanese.

Translation order:

1. Curated translation bundled with a local quote, when available
2. DeepL when `DEEPL_API_KEY` is configured
3. MyMemory public translation fallback

Translations are cached in the visitor's `localStorage` per quote/language.

## Vietnamese typography

- **Be Vietnam Pro** for interface and translated text. It was designed with Vietnamese diacritics as a first-class part of the typeface.
- **Lora** for large literary quote text. It supports Vietnamese and keeps the editorial character of the site.

Both are loaded from Google Fonts with `display=swap`.

## Run locally

```bash
npm install
npm run dev
```

For the full Netlify Functions experience use Netlify Dev if you have the CLI installed:

```bash
netlify dev
```

Build:

```bash
npm run build
```

## Netlify environment variables

Copy `.env.example` conceptually into Netlify → Site configuration → Environment variables. No key is strictly required: the site still has public-provider and local fallbacks. For the strongest topic accuracy, add `API_NINJAS_KEY`.

## API contract

Daily quote:

```text
GET /.netlify/functions/quote?mode=daily&topic=all
```

Random quote by topic:

```text
GET /.netlify/functions/quote?mode=random&topic=life
```

Translation:

```text
POST /.netlify/functions/translate
Content-Type: application/json

{ "text": "...", "language": "vi" }
```

## Goodreads

Goodreads remains a discovery/reference source for manually curated entries only. The production app does not scrape Goodreads automatically.
