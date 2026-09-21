export type Topic = 'all' | 'life' | 'love' | 'wisdom' | 'courage' | 'humor'
export type Language = 'vi' | 'fr' | 'es' | 'ja'

export type Quote = {
  id: string
  text: string
  author: string
  topic: Exclude<Topic, 'all'>
  translations: Record<Language, string>
  sourceUrl: string
}

export const languageLabels: Record<Language, string> = {
  vi: 'Tiếng Việt',
  fr: 'Français',
  es: 'Español',
  ja: '日本語',
}

export const quotes: Quote[] = [
  {
    id: 'wilde-live',
    text: 'To live is the rarest thing in the world. Most people exist, that is all.',
    author: 'Oscar Wilde',
    topic: 'life',
    translations: {
      vi: 'Sống thực sự là điều hiếm hoi nhất trên đời. Phần lớn mọi người chỉ tồn tại, vậy thôi.',
      fr: 'Vivre est la chose la plus rare au monde. La plupart des gens ne font qu’exister.',
      es: 'Vivir es lo más raro del mundo. La mayoría de la gente solo existe.',
      ja: '生きることは、この世でもっとも稀なことだ。多くの人はただ存在しているだけだ。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/life',
  },
  {
    id: 'austen-heart',
    text: 'There is no charm equal to tenderness of heart.',
    author: 'Jane Austen',
    topic: 'love',
    translations: {
      vi: 'Không có vẻ đẹp quyến rũ nào sánh bằng một trái tim dịu dàng.',
      fr: 'Aucun charme n’égale la tendresse du cœur.',
      es: 'No hay encanto comparable a la ternura del corazón.',
      ja: '心の優しさに勝る魅力はない。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/love',
  },
  {
    id: 'emerson-road',
    text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
    author: 'Ralph Waldo Emerson',
    topic: 'courage',
    translations: {
      vi: 'Đừng đi theo nơi con đường dẫn tới; hãy đi nơi chưa có đường và để lại một lối đi.',
      fr: 'N’allez pas là où le chemin peut mener ; allez là où il n’y a pas de chemin et laissez une trace.',
      es: 'No vayas donde el camino te lleve; ve donde no hay camino y deja un sendero.',
      ja: '道があるところへ行くのではなく、道のないところへ進み、そこに足跡を残しなさい。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/courage',
  },
  {
    id: 'socrates-wisdom',
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    topic: 'wisdom',
    translations: {
      vi: 'Trí tuệ thật sự nằm ở việc biết rằng mình không biết gì.',
      fr: 'La seule vraie sagesse consiste à savoir que l’on ne sait rien.',
      es: 'La única sabiduría verdadera está en saber que no sabes nada.',
      ja: '真の知恵とは、自分が何も知らないと知ることにある。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/wisdom',
  },
  {
    id: 'twain-fool',
    text: 'Never put off till tomorrow what may be done day after tomorrow just as well.',
    author: 'Mark Twain',
    topic: 'humor',
    translations: {
      vi: 'Đừng bao giờ để đến ngày mai việc mà ngày kia làm cũng vẫn kịp.',
      fr: 'Ne remettez jamais à demain ce qui peut tout aussi bien être fait après-demain.',
      es: 'Nunca dejes para mañana lo que puede hacerse igual de bien pasado mañana.',
      ja: '明後日でも間に合うことを、明日に延ばしてはいけない。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/humor',
  },
  {
    id: 'tolstoy-change',
    text: 'Everyone thinks of changing the world, but no one thinks of changing himself.',
    author: 'Leo Tolstoy',
    topic: 'wisdom',
    translations: {
      vi: 'Ai cũng nghĩ đến việc thay đổi thế giới, nhưng chẳng mấy ai nghĩ đến việc thay đổi chính mình.',
      fr: 'Tout le monde pense à changer le monde, mais personne ne pense à se changer soi-même.',
      es: 'Todos piensan en cambiar el mundo, pero nadie piensa en cambiarse a sí mismo.',
      ja: '誰もが世界を変えようと考えるが、自分自身を変えようとは考えない。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/wisdom',
  },
  {
    id: 'wilde-self',
    text: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    topic: 'life',
    translations: {
      vi: 'Hãy là chính mình; những người khác đã có người làm rồi.',
      fr: 'Soyez vous-même ; tous les autres sont déjà pris.',
      es: 'Sé tú mismo; los demás puestos ya están ocupados.',
      ja: '自分自身でありなさい。他の人はすでに誰かがやっている。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/life',
  },
  {
    id: 'austen-love',
    text: 'There is no charm equal to tenderness of heart.',
    author: 'Jane Austen',
    topic: 'love',
    translations: {
      vi: 'Không có sức hút nào bằng sự dịu dàng của trái tim.',
      fr: 'Il n’existe aucun charme égal à la tendresse du cœur.',
      es: 'No existe encanto igual a la ternura del corazón.',
      ja: '心の優しさほど人を惹きつけるものはない。',
    },
    sourceUrl: 'https://www.goodreads.com/quotes/tag/love',
  },
]

export const topics: Topic[] = ['all', 'life', 'love', 'wisdom', 'courage', 'humor']
