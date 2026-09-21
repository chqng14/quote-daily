const metFallback = [
  {
    id: 'met-436526',
    title: 'First Steps, after Millet',
    artist: 'Vincent van Gogh',
    date: '1890',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/436526/794544/main-image',
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/436526',
    source: 'The Met Open Access',
  },
  {
    id: 'met-438158',
    title: 'Springtime',
    artist: 'Pierre-Auguste Cot',
    date: '1873',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/438158/2267175/main-image',
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/438158',
    source: 'The Met Open Access',
  },
  {
    id: 'met-436839',
    title: 'The Penitent Magdalen',
    artist: 'Georges de La Tour',
    date: 'ca. 1640',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/436839/2186892/main-image',
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/436839',
    source: 'The Met Open Access',
  },
  {
    id: 'met-437517',
    title: 'An Early Summer Morning in the Forest of Fontainebleau',
    artist: 'Théodore Rousseau',
    date: 'probably 1861',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/437517/801183/main-image',
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/437517',
    source: 'The Met Open Access',
  },
]

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4500)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`Artwork source ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

function creatorName(item) {
  const creator = Array.isArray(item?.creators) ? item.creators[0] : null
  return creator?.description || creator?.name || item?.culture?.[0] || 'Unknown artist'
}

function normalizeCleveland(item) {
  const imageUrl = item?.images?.web?.url
  if (!imageUrl || item?.share_license_status !== 'CC0') return null

  return {
    id: `cma-${item.id}`,
    title: item.title || 'Untitled',
    artist: creatorName(item),
    date: item.creation_date || item.creation_date_earliest || '',
    imageUrl,
    sourceUrl: item.url || `https://www.clevelandart.org/art/${item.accession_number || item.id}`,
    source: 'Cleveland Museum of Art Open Access',
  }
}

async function randomCleveland(exclude) {
  // CMA documents ~3,200 CC0 paintings with images. Keeping the upper bound
  // below that count avoids an extra "count" request on every click.
  const skip = Math.floor(Math.random() * 3000)
  const params = new URLSearchParams({
    has_image: '1',
    type: 'Painting',
    skip: String(skip),
    limit: '18',
  })
  params.append('cc0', '')

  const data = await fetchJson(`https://openaccess-api.clevelandart.org/api/artworks/?${params.toString()}`)
  const candidates = (data?.data ?? [])
    .map(normalizeCleveland)
    .filter(Boolean)
    .filter((item) => item.id !== exclude)

  if (!candidates.length) throw new Error('Cleveland returned no usable paintings')
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function randomMetFallback(exclude) {
  const candidates = metFallback.filter((item) => item.id !== exclude)
  return candidates[Math.floor(Math.random() * candidates.length)] ?? metFallback[0]
}

export default async (request) => {
  const url = new URL(request.url)
  const exclude = url.searchParams.get('exclude') ?? ''

  try {
    const artwork = await randomCleveland(exclude)
    return json({ artwork })
  } catch {
    return json({ artwork: randomMetFallback(exclude), fallback: true })
  }
}
