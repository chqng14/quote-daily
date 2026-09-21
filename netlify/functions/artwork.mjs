function json(body, status = 200, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cache,
    },
  })
}

async function fetchArtworks(page) {
  const params = new URLSearchParams({
    q: 'painting',
    limit: '24',
    page: String(page),
    fields: 'id,title,image_id,artist_title,date_display,is_public_domain',
  })
  params.set('query[term][is_public_domain]', 'true')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4500)

  try {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?${params.toString()}`, {
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Art Institute ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

export default async () => {
  try {
    const page = 1 + Math.floor(Math.random() * 30)
    let data = await fetchArtworks(page)
    let candidates = (data?.data ?? []).filter((item) => item?.image_id && item?.is_public_domain === true)

    if (!candidates.length) {
      data = await fetchArtworks(1)
      candidates = (data?.data ?? []).filter((item) => item?.image_id && item?.is_public_domain === true)
    }

    if (!candidates.length) throw new Error('No public-domain paintings with images were returned')

    const item = candidates[Math.floor(Math.random() * candidates.length)]
    const iiif = data?.config?.iiif_url || 'https://www.artic.edu/iiif/2'

    return json({
      artwork: {
        id: String(item.id),
        title: item.title || 'Untitled',
        artist: item.artist_title || 'Unknown artist',
        date: item.date_display || '',
        imageUrl: `${iiif}/${item.image_id}/full/843,/0/default.jpg`,
        sourceUrl: `https://www.artic.edu/artworks/${item.id}`,
        source: 'Art Institute of Chicago',
      },
    })
  } catch {
    return json({ error: 'Artwork is temporarily unavailable' }, 503)
  }
}
