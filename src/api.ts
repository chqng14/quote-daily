import { quotes, type Language, type Quote, type QuoteMode, type Topic } from './quotes'

export type Artwork = {
  id: string
  title: string
  artist: string
  date: string
  imageUrl: string
  sourceUrl: string
  source: string
}

function quoteKey(quote: Pick<Quote, 'text' | 'author'>) {
  return `${quote.text.trim().replace(/\\s+/g, ' ').toLowerCase()}|${quote.author.trim().toLowerCase()}`
}

function randomLocal(topic: Topic, currentQuote?: Quote): Quote {
  const pool = topic === 'all' ? quotes : quotes.filter((item) => item.topic === topic)
  const currentKey = currentQuote ? quoteKey(currentQuote) : ''
  const candidates = pool.length > 1
    ? pool.filter((item) => quoteKey(item) !== currentKey)
    : pool
  return candidates[Math.floor(Math.random() * candidates.length)] ?? quotes[0]
}

export async function getQuote(mode: QuoteMode, topic: Topic, currentQuote?: Quote): Promise<Quote> {
  try {
    const params = new URLSearchParams({ mode, topic })
    if (currentQuote) {
      params.set('exclude', currentQuote.id)
      params.set('excludeText', currentQuote.text)
      params.set('excludeAuthor', currentQuote.author)
    }
    const response = await fetch(`/.netlify/functions/quote?${params.toString()}`, {
      cache: mode === 'random' ? 'no-store' : 'default',
    })
    if (!response.ok) throw new Error(`Quote API ${response.status}`)
    const payload = await response.json() as { quote?: Quote }
    if (!payload.quote?.text || !payload.quote?.author) throw new Error('Invalid quote response')
    if (mode === 'random' && currentQuote && quoteKey(payload.quote) === quoteKey(currentQuote)) {
      throw new Error('Quote API repeated the current quote')
    }
    return payload.quote
  } catch {
    return randomLocal(topic, currentQuote)
  }
}

export async function getArtwork(currentId?: string): Promise<Artwork | null> {
  try {
    const params = new URLSearchParams()
    if (currentId) params.set('exclude', currentId)
    const suffix = params.toString() ? `?${params.toString()}` : ''
    const response = await fetch(`/.netlify/functions/artwork${suffix}`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Artwork API ${response.status}`)
    const payload = await response.json() as { artwork?: Artwork }
    if (!payload.artwork?.imageUrl) throw new Error('Invalid artwork response')
    return payload.artwork
  } catch {
    return null
  }
}

function translationCacheKey(quote: Quote, language: Language) {
  return `quote-daily:translation:v3:${language}:${quote.id}`
}

export async function getTranslation(quote: Quote, language: Language): Promise<string> {
  const curated = quote.translations?.[language]
  if (curated) return curated

  const key = translationCacheKey(quote, language)
  const cached = localStorage.getItem(key)
  if (cached) return cached

  const response = await fetch('/.netlify/functions/translate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text: quote.text,
      language,
      author: quote.author,
      topic: quote.topic,
    }),
  })
  if (!response.ok) throw new Error(`Translation API ${response.status}`)

  const payload = await response.json() as { text?: string }
  if (!payload.text) throw new Error('Translation unavailable')
  localStorage.setItem(key, payload.text)
  return payload.text
}
