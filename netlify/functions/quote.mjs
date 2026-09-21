const TOPICS = new Set(['all', 'vietnam', 'life', 'love', 'wisdom', 'courage', 'humor'])

const topicAliases = {
  life: ['life', 'inspirational'],
  love: ['love', 'relationships'],
  wisdom: ['wisdom', 'philosophy'],
  courage: ['courage', 'inspirational'],
  humor: ['humor', 'funny'],
}

const localFallback = [
  { text: 'To live is the rarest thing in the world. Most people exist, that is all.', author: 'Oscar Wilde', topic: 'life' },
  { text: 'Life is really simple, but we insist on making it complicated.', author: 'Confucius', topic: 'life' },
  { text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama', topic: 'life' },
  { text: 'Life can only be understood backwards; but it must be lived forwards.', author: 'Søren Kierkegaard', topic: 'life' },

  { text: 'There is no charm equal to tenderness of heart.', author: 'Jane Austen', topic: 'love' },
  { text: 'We loved with a love that was more than love.', author: 'Edgar Allan Poe', topic: 'love' },
  { text: 'Love is composed of a single soul inhabiting two bodies.', author: 'Aristotle', topic: 'love' },
  { text: 'Where there is love there is life.', author: 'Mahatma Gandhi', topic: 'love' },

  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', topic: 'wisdom' },
  { text: 'The fool doth think he is wise, but the wise man knows himself to be a fool.', author: 'William Shakespeare', topic: 'wisdom' },
  { text: 'No man was ever wise by chance.', author: 'Seneca', topic: 'wisdom' },
  { text: 'Wonder is the beginning of wisdom.', author: 'Socrates', topic: 'wisdom' },

  { text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson', topic: 'courage' },
  { text: 'Courage is resistance to fear, mastery of fear—not absence of fear.', author: 'Mark Twain', topic: 'courage' },
  { text: 'He who is brave is free.', author: 'Seneca', topic: 'courage' },
  { text: 'Fortune favors the bold.', author: 'Virgil', topic: 'courage' },

  { text: 'Never put off till tomorrow what may be done day after tomorrow just as well.', author: 'Mark Twain', topic: 'humor' },
  { text: 'I can resist everything except temptation.', author: 'Oscar Wilde', topic: 'humor' },
  { text: 'If you tell the truth, you do not have to remember anything.', author: 'Mark Twain', topic: 'humor' },
  { text: 'A day without laughter is a day wasted.', author: 'Charlie Chaplin', topic: 'humor' },
]

const vietnamFallback = [
  { text: 'Trăm năm trong cõi người ta, Chữ tài chữ mệnh khéo là ghét nhau.', author: 'Nguyễn Du', topic: 'vietnam', source: 'Wikisource tiếng Việt', sourceUrl: 'https://vi.wikisource.org/wiki/Truy%E1%BB%87n_Ki%E1%BB%81u', originalLanguage: 'vi' },
  { text: 'Thiện căn ở tại lòng ta, Chữ Tâm kia mới bằng ba chữ tài.', author: 'Nguyễn Du', topic: 'vietnam', source: 'Wikisource tiếng Việt', sourceUrl: 'https://vi.wikisource.org/wiki/Truy%E1%BB%87n_Ki%E1%BB%81u_(b%E1%BA%A3n_Li%E1%BB%85u_V%C4%83n_%C3%90%C6%B0%E1%BB%9Dng_1866)', originalLanguage: 'vi' },
  { text: 'Làm ơn há dễ trông người trả ơn?', author: 'Nguyễn Đình Chiểu', topic: 'vietnam', source: 'Lục Vân Tiên · Wikisource', sourceUrl: 'https://vi.wikisource.org/wiki/L%E1%BB%A5c_V%C3%A2n_Ti%C3%AAn_(b%E1%BA%A3n_Qu%E1%BB%91c_ng%E1%BB%AF_2082_c%C3%A2u)/I', originalLanguage: 'vi' },
  { text: 'Nhớ câu kiến ngãi bất vi, Làm người thế ấy cũng phi anh hùng.', author: 'Nguyễn Đình Chiểu', topic: 'vietnam', source: 'Lục Vân Tiên · Wikisource', sourceUrl: 'https://vi.wikisource.org/wiki/L%E1%BB%A5c_V%C3%A2n_Ti%C3%AAn_(b%E1%BA%A3n_Qu%E1%BB%91c_ng%E1%BB%AF_2082_c%C3%A2u)/I', originalLanguage: 'vi' },
  { text: 'Rắn nát mặc dầu tay kẻ nặn, Mà em vẫn giữ tấm lòng son.', author: 'Hồ Xuân Hương', topic: 'vietnam', source: 'Bánh trôi nước · Wikisource', sourceUrl: 'https://vi.wikisource.org/wiki/B%C3%A1nh_tr%C3%B4i_n%C6%B0%E1%BB%9Bc', originalLanguage: 'vi' },
  { text: 'Ta dại, ta tìm nơi vắng vẻ, Người khôn, người đến chốn lao xao.', author: 'Nguyễn Bỉnh Khiêm', topic: 'vietnam', source: 'Việt thi · Wikisource', sourceUrl: 'https://vi.wikisource.org/wiki/Trang:Vi%E1%BB%87t_thi.pdf/69', originalLanguage: 'vi' },
  { text: 'Khôn mà hiểm độc là khôn dại, Dại vốn hiền lành, ấy dại khôn.', author: 'Nguyễn Bỉnh Khiêm', topic: 'vietnam', source: 'Wikisource tiếng Việt', sourceUrl: 'https://vi.wikisource.org/wiki/Th%C6%A1_v%C3%B4_%C4%91%E1%BB%81_c%E1%BB%A7a_Nguy%E1%BB%85n_B%E1%BB%89nh_Khi%C3%AAm/59', originalLanguage: 'vi' },
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

function quoteKey(text, author) {
  return `${String(text ?? '').trim().replace(/\s+/g, ' ').toLowerCase()}|${String(author ?? '').trim().toLowerCase()}`
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

function normalizedQuote({ text, author, source, sourceUrl, tags = [], requestedTopic = 'all', originalLanguage = 'en' }) {
  if (!text || !author) throw new Error(`Invalid quote from ${source}`)
  return {
    id: `${source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${hash(`${text}|${author}`)}`,
    text: String(text).trim(),
    author: String(author).trim(),
    topic: normalizeTopic(tags, requestedTopic),
    source,
    sourceUrl,
    originalLanguage,
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

function fallback(mode, topic, excludeId = '', excludeKey = '') {
  const basePool = topic === 'vietnam' ? vietnamFallback : localFallback
  const pool = topic === 'all' ? localFallback : basePool.filter((item) => item.topic === topic)
  const normalized = pool.map((item) => normalizedQuote({
    ...item,
    source: item.source ?? 'Quote Daily collection',
    sourceUrl: item.sourceUrl ?? 'https://www.goodreads.com/quotes',
    tags: [item.topic],
    requestedTopic: topic,
    originalLanguage: item.originalLanguage ?? 'en',
  }))
  const candidates = mode === 'random' && normalized.length > 1
    ? normalized.filter((item) => item.id !== excludeId && quoteKey(item.text, item.author) !== excludeKey)
    : normalized
  const day = new Date().toISOString().slice(0, 10)
  const index = mode === 'daily'
    ? parseInt(hash(`${day}|${topic}`), 36) % candidates.length
    : Math.floor(Math.random() * candidates.length)
  return candidates[index] ?? normalized[0] ?? normalizedQuote({
    ...localFallback[0],
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes',
    tags: [localFallback[0].topic],
    requestedTopic: 'all',
  })
}

export default async (request) => {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') === 'daily' ? 'daily' : 'random'
  const rawTopic = url.searchParams.get('topic') ?? 'all'
  const topic = TOPICS.has(rawTopic) ? rawTopic : 'all'
  const excludeId = url.searchParams.get('exclude') ?? ''
  const excludeText = url.searchParams.get('excludeText') ?? ''
  const excludeAuthor = url.searchParams.get('excludeAuthor') ?? ''
  const excludeKey = excludeText ? quoteKey(excludeText, excludeAuthor) : ''

  if (topic === 'vietnam') {
    const quote = fallback(mode, topic, excludeId, excludeKey)
    const cache = mode === 'daily'
      ? 'public, max-age=300, s-maxage=21600, stale-while-revalidate=86400'
      : 'no-store'
    return json({ quote, mode, provider: quote.source }, 200, cache)
  }

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
      if (
        mode === 'random' &&
        ((excludeId && quote.id === excludeId) || (excludeKey && quoteKey(quote.text, quote.author) === excludeKey))
      ) {
        errors.push(`${quote.source} repeated the current quote`)
        continue
      }
      const cache = mode === 'daily'
        ? 'public, max-age=300, s-maxage=21600, stale-while-revalidate=86400'
        : 'no-store'
      return json({ quote, mode, provider: quote.source }, 200, cache)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  const quote = fallback(mode, topic, excludeId, excludeKey)
  return json({ quote, mode, provider: quote.source, fallback: true, errors: process.env.CONTEXT === 'dev' ? errors : undefined })
}
