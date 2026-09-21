const SEARCH_URL = 'https://collectionapi.metmuseum.org/public/collection/v1.1/search'
const OBJECT_URL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects'

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

async function safeFetch(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`The Met API ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

function searchUrl(offset, limit) {
  const params = new URLSearchParams({
    hasImages: 'true',
    medium: 'Paintings',
    dateBegin: '1200',
    dateEnd: '1900',
    offset: String(offset),
    limit: String(limit),
  })
  return `${SEARCH_URL}?${params.toString()}`
}

async function getBatch() {
  const first = await safeFetch(searchUrl(0, 1))
  const total = Math.min(Number(first?.total) || 0, 10000)
  if (!total) throw new Error('The Met returned no paintings')

  const limit = Math.min(10, total)
  const maxOffset = Math.max(0, total - limit)
  const offset = Math.floor(Math.random() * (maxOffset + 1))
  const page = await safeFetch(searchUrl(offset, limit))
  return page?.objectIDs ?? []
}

async function loadObject(id) {
  try {
    const item = await safeFetch(`${OBJECT_URL}/${id}`)
    if (!item?.isPublicDomain || !item?.primaryImageSmall) return null
    return item
  } catch {
    return null
  }
}

export default async () => {
  try {
    let candidates = []

    for (let attempt = 0; attempt < 2 && !candidates.length; attempt += 1) {
      const ids = await getBatch()
      const objects = await Promise.all(ids.map(loadObject))
      candidates = objects.filter(Boolean)
    }

    if (!candidates.length) throw new Error('No public-domain paintings with images were returned')

    const item = candidates[Math.floor(Math.random() * candidates.length)]

    return json({
      artwork: {
        id: String(item.objectID),
        title: item.title || 'Untitled',
        artist: item.artistDisplayName || item.culture || 'Unknown artist',
        date: item.objectDate || '',
        imageUrl: item.primaryImageSmall,
        sourceUrl: item.objectURL || `https://www.metmuseum.org/art/collection/search/${item.objectID}`,
        source: 'The Metropolitan Museum of Art',
      },
    })
  } catch {
    return json({ error: 'Artwork is temporarily unavailable' }, 503)
  }
}
