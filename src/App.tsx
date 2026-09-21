import { useEffect, useMemo, useRef, useState } from 'react'
import { getQuote, getTranslation } from './api'
import {
  languageLabels,
  quotes,
  topicMeta,
  topics,
  type Language,
  type Quote,
  type QuoteMode,
  type Topic,
} from './quotes'

const LANGUAGE_KEY = 'quote-daily-language'

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null
  if (saved && saved in languageLabels) return saved

  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('fr')) return 'fr'
  if (browser.startsWith('es')) return 'es'
  if (browser.startsWith('ja')) return 'ja'
  return 'vi'
}

function ArtField() {
  return (
    <div className="art-field" aria-hidden="true">
      <span className="art-wash" />
      <span className="art-sun" />
      <span className="art-orbit orbit-one" />
      <span className="art-orbit orbit-two" />
      <span className="art-brush brush-one" />
      <span className="art-brush brush-two" />
      <span className="art-petal petal-one" />
      <span className="art-petal petal-two" />
      <span className="art-grid" />
    </div>
  )
}

export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [topic, setTopic] = useState<Topic>('all')
  const [mode, setMode] = useState<QuoteMode>('daily')
  const [quote, setQuote] = useState<Quote>(quotes[0])
  const [translation, setTranslation] = useState(quote.translations?.[language] ?? '')
  const [loading, setLoading] = useState(false)
  const [translationLoading, setTranslationLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const requestId = useRef(0)

  const visualTopic = topic === 'all' ? quote.topic : topic
  const meta = topicMeta[visualTopic]
  const quoteNumber = useMemo(() => {
    let total = 0
    for (const char of quote.id) total = (total + char.charCodeAt(0)) % 99
    return String(total || 1).padStart(2, '0')
  }, [quote.id])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    const id = ++requestId.current
    setTranslationLoading(true)
    getTranslation(quote, language)
      .then((text) => {
        if (requestId.current === id) setTranslation(text)
      })
      .catch(() => {
        if (requestId.current === id) setTranslation('Translation is resting for a moment.')
      })
      .finally(() => {
        if (requestId.current === id) setTranslationLoading(false)
      })
  }, [quote, language])

  useEffect(() => {
    void loadQuote('daily', 'all')
    // Initial gallery load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadQuote(nextMode: QuoteMode, nextTopic: Topic = topic) {
    setLoading(true)
    setCopied(false)
    setMode(nextMode)
    try {
      const next = await getQuote(nextMode, nextTopic, quote.id)
      setQuote(next)
    } finally {
      setLoading(false)
    }
  }

  function selectTopic(nextTopic: Topic) {
    setTopic(nextTopic)
    void loadQuote('random', nextTopic)
  }

  async function copyQuote() {
    const translatedLine = translation ? `\n${translation}` : ''
    await navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}${translatedLine}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="page" data-theme={visualTopic}>
      <ArtField />
      <div className="grain" aria-hidden="true" />

      <header className="masthead">
        <a className="brand" href="/" aria-label="Quote Daily home">
          <span className="brand-mark">Q</span>
          <span className="brand-copy">
            <strong>Quote Daily</strong>
            <small>Words as a gallery</small>
          </span>
        </a>

        <div className="header-controls">
          <button className="today-button" onClick={() => void loadQuote('daily', topic)}>
            Today’s piece
          </button>
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

      <div className="gallery-shell">
        <aside className="gallery-rail">
          <div className="rail-label">Collection</div>
          <nav className="topics" aria-label="Quote topics">
            {topics.map((item) => (
              <button
                key={item}
                className={item === topic ? 'topic active' : 'topic'}
                onClick={() => selectTopic(item)}
              >
                <span>{topicMeta[item].label}</span>
                <small>{topicMeta[item].movement}</small>
              </button>
            ))}
          </nav>
        </aside>

        <section className="quote-stage" aria-live="polite" aria-busy={loading}>
          <div className="edition-meta">
            <span>{mode === 'daily' ? 'Daily edition' : 'Open edition'}</span>
            <span>{meta.movement}</span>
            <span>No. {quoteNumber}</span>
          </div>

          <figure key={quote.id} className={loading ? 'quote is-loading' : 'quote'}>
            <blockquote>“{quote.text}”</blockquote>

            <div className={translationLoading ? 'translation is-loading' : 'translation'} lang={language}>
              <span className="translation-mark">↳</span>
              <span>{translation}</span>
            </div>

            <figcaption>
              <span className="caption-line" />
              <span className="author">{quote.author}</span>
              <span className="dot">·</span>
              {quote.sourceUrl ? (
                <a href={quote.sourceUrl} target="_blank" rel="noreferrer">{quote.source}</a>
              ) : (
                <span>{quote.source}</span>
              )}
            </figcaption>
          </figure>

          <div className="actions">
            <button className="random-button" onClick={() => void loadQuote('random')} disabled={loading}>
              <span>{loading ? 'Finding a thought…' : 'Another thought'}</span>
              <span className="arrow" aria-hidden="true">↗</span>
            </button>
            <button className="copy-button" onClick={copyQuote}>{copied ? 'Copied' : 'Copy'}</button>
          </div>

          <div className="curatorial-note">
            <span className="note-number">{quoteNumber}</span>
            <div>
              <small>{meta.caption}</small>
              <p>Each collection changes palette, rhythm and gesture while the words stay at the center.</p>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <span>Curated slowly · served from multiple quote archives</span>
        <span>Typography: Lora × Be Vietnam Pro</span>
      </footer>
    </main>
  )
}
