import { useEffect, useMemo, useState } from 'react'
import { languageLabels, quotes, topics, type Language, type Quote, type Topic } from './quotes'

const LANGUAGE_KEY = 'quote-daily-language'

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null
  if (saved && saved in languageLabels) return saved

  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('vi')) return 'vi'
  if (browser.startsWith('fr')) return 'fr'
  if (browser.startsWith('es')) return 'es'
  if (browser.startsWith('ja')) return 'ja'
  return 'vi'
}

function randomQuote(pool: Quote[], currentId?: string) {
  const candidates = pool.length > 1 ? pool.filter((quote) => quote.id !== currentId) : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [topic, setTopic] = useState<Topic>('all')
  const [quote, setQuote] = useState<Quote>(() => quotes[Math.floor(Math.random() * quotes.length)])
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(
    () => (topic === 'all' ? quotes : quotes.filter((item) => item.topic === topic)),
    [topic],
  )

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    if (!filtered.some((item) => item.id === quote.id)) {
      setQuote(randomQuote(filtered))
    }
  }, [filtered, quote.id])

  function drawQuote() {
    setQuote(randomQuote(filtered, quote.id))
    setCopied(false)
  }

  async function copyQuote() {
    await navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="page">
      <div className="grain" aria-hidden="true" />

      <header className="masthead">
        <a className="brand" href="/" aria-label="Quote Daily home">
          <span className="brand-mark">Q</span>
          <span>Quote Daily</span>
        </a>

        <div className="header-controls">
          <label className="language-control">
            <span>Translation</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              aria-label="Translation language"
            >
              {Object.entries(languageLabels).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <nav className="topics" aria-label="Quote topics">
        {topics.map((item) => (
          <button
            key={item}
            className={item === topic ? 'topic active' : 'topic'}
            onClick={() => setTopic(item)}
          >
            {item === 'all' ? 'All thoughts' : item}
          </button>
        ))}
      </nav>

      <section className="quote-stage" aria-live="polite">
        <div className="index" aria-hidden="true">
          {(quotes.findIndex((item) => item.id === quote.id) + 1).toString().padStart(2, '0')}
        </div>

        <figure key={quote.id} className="quote">
          <blockquote>“{quote.text}”</blockquote>
          <div className="translation">{quote.translations[language]}</div>

          <figcaption>
            <span className="line" />
            <span className="author">{quote.author}</span>
            <span className="dot">·</span>
            <a href={quote.sourceUrl} target="_blank" rel="noreferrer">Goodreads / {quote.topic}</a>
          </figcaption>
        </figure>

        <div className="actions">
          <button className="random-button" onClick={drawQuote}>
            <span>Another thought</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </button>
          <button className="copy-button" onClick={copyQuote}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </section>

      <footer>
        <span>Curated words for unhurried moments.</span>
        <span className="footer-note">Space to read. Click to wander.</span>
      </footer>
    </main>
  )
}
