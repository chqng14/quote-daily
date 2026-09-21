const TOPICS = new Set(['all', 'life', 'love', 'wisdom', 'courage', 'humor'])

const topicAliases = {
  life: ['life', 'inspirational'],
  love: ['love', 'relationships'],
  wisdom: ['wisdom', 'philosophy'],
  courage: ['courage', 'inspirational'],
  humor: ['humor', 'funny'],
}

const localFallback = [
  { text: 'To live is the rarest thing in the world. Most people exist, that is all.', author: 'Oscar Wilde', topic: 'life' },
  { text: 'There is no charm equal to tenderness of heart.', author: 'Jane Austen', topic: 'love' },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', topic: 'wisdom' },
  { text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson', topic: 'courage' },
  { text: 'Never put off till tomorrow what may be done day after tomorrow just as well.', author: 'Mark Twain', topic: 'humor' },
]

function json(body, status = 200, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cache,
    },
  })
}

function hash(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36)
}

function normalizeTopic(tags = [], requested = 'all') {
  if (requested !== 'all') return requested
  const lower = tags.map((tag) => String(tag).toLowerCase())
  for (const [topic, aliases] of Object.entries(topicAliases)) {
    if (aliases.some((alias) => lower.includes(alias))) return topic
  }
  return 'life'
}

function normalizedQuote({ text, author, source, sourceUrl, tags = [], requestedTopic = 'all' }) {
  if (!text || !author) throw new Error(`Invalid quote from ${source}`)
  return {
    id: `${source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${hash(`${text}|${author}`)}`,
    text: String(text).trim(),
    author: String(author).trim(),
    topic: normalizeTopic(tags, requestedTopic),
    source,
    sourceUrl,
  }
}

async function safeFetch(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4500)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function apiNinjas(mode, topic) {
  const key = process.env.API_NINJAS_KEY
  if (!key) throw new Error('API_NINJAS_KEY is not configured')
  const endpoint = mode === 'daily' ? 'quoteoftheday' : 'randomquotes'
  const params = mode === 'random' && topic !== 'all' ? `?categories=${encodeURIComponent(topic)}` : ''
  const data = await safeFetch(`https://api.api-ninjas.com/v2/${endpoint}${params}`, {
    headers: { 'X-Api-Key': key },
  })
  const item = data?.[0]
  return normalizedQuote({
    text: item?.quote,
    author: item?.author,
    source: 'API Ninjas',
    sourceUrl: 'https://api-ninjas.com/api/quotes',
    tags: item?.categories ?? [],
    requestedTopic: topic,
  })
}

async function theySaidSo(mode, topic) {
  const key = process.env.THEYSAIDSO_API_KEY
  const headers = key ? { 'X-TheySaidSo-Api-Secret': key } : {}
  const categoryMap = { life: 'inspire', love: 'love', wisdom: 'wisdom', courage: 'inspire', humor: 'funny' }

  let url
  if (mode === 'daily') {
    const category = topic === 'all' ? 'inspire' : categoryMap[topic]
    url = `https://quotes.rest/qod.json?category=${encodeURIComponent(category)}`
  } else {
    if (!key) throw new Error('THEYSAIDSO_API_KEY is required for random quotes')
    const query = topic === 'all' ? 'inspire' : topic
    url = `https://quotes.rest/quote/search.json?query=${encodeURIComponent(query)}&limit=3`
  }

  const data = await safeFetch(url, { headers })
  const candidates = data?.contents?.quotes ?? []
  const item = candidates[Math.floor(Math.random() * candidates.length)]
  return normalizedQuote({
    text: item?.quote,
    author: item?.author,
    source: 'They Said So',
    sourceUrl: 'https://theysaidso.com',
    tags: item?.tags ?? [item?.category].filter(Boolean),
    requestedTopic: topic,
  })
}

async function zenQuotes(mode, topic) {
  if (topic !== 'all') throw new Error('ZenQuotes topic filtering is skipped in auto mode')
  const key = process.env.ZENQUOTES_KEY
  const endpoint = mode === 'daily' ? 'today' : 'random'
  const suffix = key ? `/${key}` : ''
  const data = await safeFetch(`https://zenquotes.io/api/${endpoint}${suffix}`)
  const item = data?.[0]
  return normalizedQuote({
    text: item?.q,
    author: item?.a,
    source: 'ZenQuotes',
    sourceUrl: 'https://zenquotes.io',
    requestedTopic: 'all',
  })
}

async function favQs(mode, topic) {
  if (mode === 'daily') {
    if (topic !== 'all') throw new Error('FavQs QOTD has no topic filter')
    const item = await safeFetch('https://favqs.com/api/qotd')
    return normalizedQuote({
      text: item?.quote?.body ?? item?.body,
      author: item?.quote?.author ?? item?.author,
      source: 'FavQs',
      sourceUrl: item?.quote?.url ?? item?.url ?? 'https://favqs.com',
      requestedTopic: 'all',
    })
  }

  const token = process.env.FAVQS_TOKEN
  if (!token) throw new Error('FAVQS_TOKEN is required for random quotes')
  const params = topic === 'all' ? '' : `?filter=${encodeURIComponent(topic)}&type=tag`
  const data = await safeFetch(`https://favqs.com/api/quotes/${params}`, {
    headers: { Authorization: `Token token="${token}"` },
  })
  const list = (data?.quotes ?? []).filter((item) => item?.body && item?.author)
  const item = list[Math.floor(Math.random() * list.length)]
  return normalizedQuote({
    text: item?.body,
    author: item?.author,
    source: 'FavQs',
    sourceUrl: item?.url ?? 'https://favqs.com',
    tags: item?.tags ?? [],
    requestedTopic: topic,
  })
}

async function quotable(mode, topic) {
  if (mode === 'daily') throw new Error('Quotable has no daily endpoint')
  const tagMap = { life: 'life', love: 'love', wisdom: 'wisdom|philosophy', courage: 'inspirational', humor: 'humorous' }
  const params = topic === 'all' ? '' : `?tags=${encodeURIComponent(tagMap[topic] ?? topic)}`
  const data = await safeFetch(`https://api.quotable.io/quotes/random${params}`)
  const item = Array.isArray(data) ? data[0] : data
  return normalizedQuote({
    text: item?.content,
    author: item?.author,
    source: 'Quotable',
    sourceUrl: 'https://github.com/lukePeavey/quotable',
    tags: item?.tags ?? [],
    requestedTopic: topic,
  })
}

function fallback(mode, topic) {
  const pool = topic === 'all' ? localFallback : localFallback.filter((item) => item.topic === topic)
  const day = new Date().toISOString().slice(0, 10)
  const index = mode === 'daily'
    ? parseInt(hash(`${day}|${topic}`), 36) % pool.length
    : Math.floor(Math.random() * pool.length)
  const item = pool[index] ?? localFallback[0]
  return normalizedQuote({
    ...item,
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes',
    tags: [item.topic],
    requestedTopic: topic,
  })
}

export default async (request) => {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') === 'daily' ? 'daily' : 'random'
  const rawTopic = url.searchParams.get('topic') ?? 'all'
  const topic = TOPICS.has(rawTopic) ? rawTopic : 'all'

  const providers = mode === 'daily'
    ? [apiNinjas, theySaidSo, zenQuotes, favQs]
    : [apiNinjas, theySaidSo, favQs, quotable, zenQuotes]

  const seed = mode === 'daily'
    ? parseInt(hash(`${new Date().toISOString().slice(0, 10)}|${topic}`), 36)
    : Math.floor(Math.random() * 100000)
  const start = seed % providers.length
  const attempts = [...providers.slice(start), ...providers.slice(0, start)]
  const errors = []

  for (const provider of attempts) {
    try {
      const quote = await provider(mode, topic)
      const cache = mode === 'daily'
        ? 'public, max-age=300, s-maxage=21600, stale-while-revalidate=86400'
        : 'no-store'
      return json({ quote, mode, provider: quote.source }, 200, cache)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  const quote = fallback(mode, topic)
  return json({ quote, mode, provider: quote.source, fallback: true, errors: process.env.CONTEXT === 'dev' ? errors : undefined })
}
