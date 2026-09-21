const artworks = [
  {
    id: '436526',
    title: 'First Steps, after Millet',
    artist: 'Vincent van Gogh',
    date: '1890',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/436526/794544/main-image',
    source: 'The Met Open Access',
  },
  {
    id: '438158',
    title: 'Springtime',
    artist: 'Pierre-Auguste Cot',
    date: '1873',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/438158/2267175/main-image',
    source: 'The Met Open Access',
  },
  {
    id: '436839',
    title: 'The Penitent Magdalen',
    artist: 'Georges de La Tour',
    date: 'ca. 1640',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/436839/2186892/main-image',
    source: 'The Met Open Access',
  },
  {
    id: '437517',
    title: 'An Early Summer Morning in the Forest of Fontainebleau',
    artist: 'Théodore Rousseau',
    date: 'probably 1861',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/437517/801183/main-image',
    source: 'The Met Open Access',
  },
  {
    id: '436451',
    title: 'Tahitian Landscape',
    artist: 'Paul Gauguin',
    date: '1892',
    imageUrl: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/436451/1857529/main-image',
    source: 'The Met Open Access',
  },
]

function json(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export default async (request) => {
  const url = new URL(request.url)
  const exclude = url.searchParams.get('exclude') ?? ''
  const candidates = artworks.length > 1
    ? artworks.filter((item) => item.id !== exclude)
    : artworks
  const artwork = candidates[Math.floor(Math.random() * candidates.length)] ?? artworks[0]

  return json({
    artwork: {
      ...artwork,
      sourceUrl: artwork.imageUrl,
    },
  })
}
