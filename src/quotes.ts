export type Topic = 'all' | 'life' | 'love' | 'wisdom' | 'courage' | 'humor'
export type Language = 'vi' | 'fr' | 'es' | 'ja'
export type QuoteMode = 'daily' | 'random'

export type Quote = {
  id: string
  text: string
  author: string
  topic: Exclude<Topic, 'all'>
  source: string
  sourceUrl?: string
  translations?: Partial<Record<Language, string>>
}

export const languageLabels: Record<Language, string> = {
  vi: 'Tiếng Việt',
  fr: 'Français',
  es: 'Español',
  ja: '日本語',
}

export const topicMeta: Record<Topic, { label: string; caption: string; movement: string }> = {
  all: { label: 'All thoughts', caption: 'The open collection', movement: 'Atelier study' },
  life: { label: 'Life', caption: 'Motion, weather, becoming', movement: 'Post-impressionist' },
  love: { label: 'Love', caption: 'Tenderness in ornament', movement: 'Art Nouveau' },
  wisdom: { label: 'Wisdom', caption: 'Silence before the answer', movement: 'Ink & ukiyo-e' },
  courage: { label: 'Courage', caption: 'Heat, fracture, forward motion', movement: 'Expressionist' },
  humor: { label: 'Humor', caption: 'A bright interruption', movement: 'Graphic modernism' },
}

export const quotes: Quote[] = [
  {
    id: 'wilde-live',
    text: 'To live is the rarest thing in the world. Most people exist, that is all.',
    author: 'Oscar Wilde',
    topic: 'life',
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes/tag/life',
    translations: {
      vi: 'Sống thực sự là điều hiếm hoi nhất trên đời. Phần lớn mọi người chỉ tồn tại, vậy thôi.',
      fr: 'Vivre est la chose la plus rare au monde. La plupart des gens ne font qu’exister.',
      es: 'Vivir es lo más raro del mundo. La mayoría de la gente solo existe.',
      ja: '生きることは、この世でもっとも稀なことだ。多くの人はただ存在しているだけだ。',
    },
  },
  {
    id: 'austen-heart',
    text: 'There is no charm equal to tenderness of heart.',
    author: 'Jane Austen',
    topic: 'love',
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes/tag/love',
    translations: {
      vi: 'Không có vẻ đẹp quyến rũ nào sánh bằng một trái tim dịu dàng.',
      fr: 'Aucun charme n’égale la tendresse du cœur.',
      es: 'No hay encanto comparable a la ternura del corazón.',
      ja: '心の優しさに勝る魅力はない。',
    },
  },
  {
    id: 'emerson-road',
    text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
    author: 'Ralph Waldo Emerson',
    topic: 'courage',
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes/tag/courage',
    translations: {
      vi: 'Đừng đi theo nơi con đường dẫn tới; hãy đi nơi chưa có đường và để lại một lối đi.',
      fr: 'N’allez pas là où le chemin peut mener ; allez là où il n’y a pas de chemin et laissez une trace.',
      es: 'No vayas donde el camino te lleve; ve donde no hay camino y deja un sendero.',
      ja: '道があるところへ行くのではなく、道のないところへ進み、そこに足跡を残しなさい。',
    },
  },
  {
    id: 'socrates-wisdom',
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    topic: 'wisdom',
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes/tag/wisdom',
    translations: {
      vi: 'Trí tuệ thật sự nằm ở việc biết rằng mình không biết gì.',
      fr: 'La seule vraie sagesse consiste à savoir que l’on ne sait rien.',
      es: 'La única sabiduría verdadera está en saber que no sabes nada.',
      ja: '真の知恵とは、自分が何も知らないと知ることにある。',
    },
  },
  {
    id: 'twain-fool',
    text: 'Never put off till tomorrow what may be done day after tomorrow just as well.',
    author: 'Mark Twain',
    topic: 'humor',
    source: 'Quote Daily collection',
    sourceUrl: 'https://www.goodreads.com/quotes/tag/humor',
    translations: {
      vi: 'Đừng bao giờ để đến ngày mai việc mà ngày kia làm cũng vẫn kịp.',
      fr: 'Ne remettez jamais à demain ce qui peut tout aussi bien être fait après-demain.',
      es: 'Nunca dejes para mañana lo que puede hacerse igual de bien pasado mañana.',
      ja: '明後日でも間に合うことを、明日に延ばしてはいけない。',
    },
  },
  {
    id: 'confucius-simple-life',
    text: 'Life is really simple, but we insist on making it complicated.',
    author: 'Confucius',
    topic: 'life',
    source: 'Quote Daily collection',
  },
  {
    id: 'kierkegaard-life',
    text: 'Life can only be understood backwards; but it must be lived forwards.',
    author: 'Søren Kierkegaard',
    topic: 'life',
    source: 'Quote Daily collection',
  },
  {
    id: 'poe-love',
    text: 'We loved with a love that was more than love.',
    author: 'Edgar Allan Poe',
    topic: 'love',
    source: 'Quote Daily collection',
  },
  {
    id: 'gandhi-love',
    text: 'Where there is love there is life.',
    author: 'Mahatma Gandhi',
    topic: 'love',
    source: 'Quote Daily collection',
  },
  {
    id: 'shakespeare-wise-fool',
    text: 'The fool doth think he is wise, but the wise man knows himself to be a fool.',
    author: 'William Shakespeare',
    topic: 'wisdom',
    source: 'Quote Daily collection',
  },
  {
    id: 'seneca-wise',
    text: 'No man was ever wise by chance.',
    author: 'Seneca',
    topic: 'wisdom',
    source: 'Quote Daily collection',
  },
  {
    id: 'twain-courage',
    text: 'Courage is resistance to fear, mastery of fear—not absence of fear.',
    author: 'Mark Twain',
    topic: 'courage',
    source: 'Quote Daily collection',
  },
  {
    id: 'seneca-brave',
    text: 'He who is brave is free.',
    author: 'Seneca',
    topic: 'courage',
    source: 'Quote Daily collection',
  },
  {
    id: 'wilde-temptation',
    text: 'I can resist everything except temptation.',
    author: 'Oscar Wilde',
    topic: 'humor',
    source: 'Quote Daily collection',
  },
  {
    id: 'chaplin-laughter',
    text: 'A day without laughter is a day wasted.',
    author: 'Charlie Chaplin',
    topic: 'humor',
    source: 'Quote Daily collection',
  }
]

export const topics: Topic[] = ['all', 'life', 'love', 'wisdom', 'courage', 'humor']
