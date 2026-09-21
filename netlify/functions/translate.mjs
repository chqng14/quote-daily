const ALLOWED_LANGUAGES = new Set(['vi', 'fr', 'es', 'ja'])

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

async function translateWithDeepL(text, language) {
  const key = process.env.DEEPL_API_KEY
  if (!key) throw new Error('DEEPL_API_KEY is not configured')
  const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com'
  const response = await fetch(`${host}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: [text], source_lang: 'EN', target_lang: language.toUpperCase() }),
  })
  if (!response.ok) throw new Error(`DeepL ${response.status}`)
  const data = await response.json()
  const translated = data?.translations?.[0]?.text
  if (!translated) throw new Error('DeepL returned no translation')
  return { text: translated, provider: 'DeepL' }
}

async function translateWithMyMemory(text, language) {
  const params = new URLSearchParams({ q: text, langpair: `en|${language}` })
  if (process.env.MYMEMORY_EMAIL) params.set('de', process.env.MYMEMORY_EMAIL)
  const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`)
  if (!response.ok) throw new Error(`MyMemory ${response.status}`)
  const data = await response.json()
  const translated = data?.responseData?.translatedText
  if (!translated || data?.responseStatus >= 400) throw new Error('MyMemory returned no translation')
  return { text: translated, provider: 'MyMemory' }
}

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405)

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const text = String(payload?.text ?? '').trim()
  const language = String(payload?.language ?? '').toLowerCase()
  if (!text || text.length > 480) return json({ error: 'Text must be between 1 and 480 characters' }, 400)
  if (!ALLOWED_LANGUAGES.has(language)) return json({ error: 'Unsupported language' }, 400)

  const providers = [translateWithDeepL, translateWithMyMemory]
  for (const provider of providers) {
    try {
      const result = await provider(text, language)
      return json(result)
    } catch {
      // Try the next translation provider.
    }
  }

  return json({ error: 'Translation is temporarily unavailable' }, 503)
}
