import { useEffect, useMemo, useRef, useState } from 'react'
import { getArtwork, getQuote, getTranslation, type Artwork } from './api'
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
const AUTO_INTERVAL_KEY = 'quote-daily-auto-seconds'

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null
  if (saved && saved in languageLabels) return saved

  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('en')) return 'en'
  if (browser.startsWith('fr')) return 'fr'
  if (browser.startsWith('es')) return 'es'
  if (browser.startsWith('ja')) return 'ja'
  return 'en'
}

function getInitialAutoSeconds() {
  const saved = Number(localStorage.getItem(AUTO_INTERVAL_KEY))
  return [15, 30, 60, 120, 300].includes(saved) ? saved : 30
}

export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [topic, setTopic] = useState<Topic>('all')
  const [mode, setMode] = useState<QuoteMode>('daily')
  const [quote, setQuote] = useState<Quote>(quotes[0])
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [translation, setTranslation] = useState(quote.translations?.[language] ?? '')
  const [loading, setLoading] = useState(false)
  const [artLoading, setArtLoading] = useState(false)
  const [translationLoading, setTranslationLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [autoEnabled, setAutoEnabled] = useState(false)
  const [autoSeconds, setAutoSeconds] = useState(getInitialAutoSeconds)
  const requestId = useRef(0)

  const quoteNumber = useMemo(() => {
    let total = 0
    for (const char of quote.id) total = (total + char.charCodeAt(0)) % 99
    return String(total || 1).padStart(2, '0')
  }, [quote.id])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(AUTO_INTERVAL_KEY, String(autoSeconds))
  }, [autoSeconds])

  useEffect(() => {
    const id = ++requestId.current
    const sourceLanguage = quote.originalLanguage ?? 'en'
    if (sourceLanguage === language) {
      setTranslation('')
      setTranslationLoading(false)
      return
    }

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
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!autoEnabled || loading) return

    const timer = window.setTimeout(() => {
      if (!document.hidden) void loadQuote('random', topic)
    }, autoSeconds * 1000)

    return () => window.clearTimeout(timer)
  }, [autoEnabled, autoSeconds, topic, quote.id, artwork?.id, loading])

  async function loadQuote(nextMode: QuoteMode, nextTopic: Topic = topic) {
    setLoading(true)
    setArtLoading(true)
    setCopied(false)
    setMode(nextMode)

    try {
      const [nextQuote, nextArtwork] = await Promise.all([
        getQuote(nextMode, nextTopic, quote),
        getArtwork(artwork?.id, nextTopic),
      ])
      setQuote(nextQuote)
      setArtwork(nextArtwork)
    } finally {
      setLoading(false)
      setArtLoading(false)
    }
  }

  async function refreshArtwork() {
    setArtLoading(true)
    try {
      const nextArtwork = await getArtwork(artwork?.id, topic)
      if (nextArtwork) setArtwork(nextArtwork)
    } finally {
      setArtLoading(false)
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
    <main className="page">
      <header className="masthead">
        <a className="brand" href="/" aria-label="Quote Daily home">
          <span className="brand-mark">Q</span>
          <span className="brand-copy">
            <strong>Quote Daily</strong>
            <small>Words beside art</small>
          </span>
        </a>

        <div className="header-controls">
          <button className="text-button" onClick={() => void loadQuote('daily', topic)}>
            Today
          </button>
          <div className="auto-controls">
            <button
              className={autoEnabled ? 'auto-toggle is-on' : 'auto-toggle'}
              type="button"
              aria-pressed={autoEnabled}
              onClick={() => setAutoEnabled((value) => !value)}
            >
              Auto {autoEnabled ? 'On' : 'Off'}
            </button>
            <label className="auto-time">
              <span>Every</span>
              <select
                value={autoSeconds}
                onChange={(event) => setAutoSeconds(Number(event.target.value))}
                aria-label="Auto change interval"
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={120}>2m</option>
                <option value={300}>5m</option>
              </select>
            </label>
          </div>
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
            onClick={() => selectTopic(item)}
          >
            {topicMeta[item].label}
          </button>
        ))}
      </nav>

      <section className="composition">
        <div className="quote-panel" aria-live="polite" aria-busy={loading}>
          <div className="edition-meta">
            <span>{mode === 'daily' ? 'Daily edition' : 'Open edition'}</span>
            <span>{topic === 'all' ? 'All thoughts' : topicMeta[topic].label}</span>
            <span>No. {quoteNumber}</span>
          </div>

          <figure key={quote.id} className={loading ? 'quote is-loading' : 'quote'}>
            <blockquote lang={quote.originalLanguage ?? 'en'}>“{quote.text}”</blockquote>

            {(translationLoading || translation) && (
              <div className={translationLoading ? 'translation is-loading' : 'translation'} lang={language}>
                <span className="translation-mark">↳</span>
                <span>{translationLoading && !translation ? 'Translating…' : translation}</span>
              </div>
            )}

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
              <span>{loading ? 'Finding…' : 'Another thought'}</span>
              <span aria-hidden="true">↗</span>
            </button>
            <button className="text-button" onClick={copyQuote}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>

        <figure className={artLoading ? 'artwork is-loading' : 'artwork'}>
          {artwork ? (
            <>
              <div className="artwork-frame">
                <img
                  key={artwork.id}
                  src={artwork.imageUrl}
                  alt={`${artwork.title} by ${artwork.artist}`}
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              <figcaption className="artwork-caption">
                <div>
                  <a href={artwork.sourceUrl} target="_blank" rel="noreferrer">
                    <strong>{artwork.title}</strong>
                  </a>
                  <span>{artwork.artist}{artwork.date ? ` · ${artwork.date}` : ''}</span>
                </div>
                <button className="art-refresh" onClick={() => void refreshArtwork()} disabled={artLoading}>
                  New art
                </button>
              </figcaption>
            </>
          ) : (
            <div className="artwork-frame artwork-placeholder" aria-hidden="true">
              <span>Art is arriving…</span>
            </div>
          )}
        </figure>
      </section>

      <footer>
        <span>Quotes from multiple archives · open-access paintings from museum collections</span>
        <span>Lora × Be Vietnam Pro</span>
      </footer>
    </main>
  )
}
