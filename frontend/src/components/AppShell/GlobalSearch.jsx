import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../contexts/use-settings'
import { runSearch } from '../../search/search-registry'
import { SearchIcon } from './shell-icons'

/**
 * The search field in the header, and the palette it opens.
 *
 * It contains no knowledge of what is searchable - it asks the registry, which
 * every feature registers into. Right now only the navigation is registered, so
 * the palette works end to end while there is still almost nothing to find.
 */
export function GlobalSearch() {
  const t = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQuery('')
  }, [open])

  useEffect(() => {
    let cancelled = false
    runSearch(query).then((found) => {
      if (!cancelled) setResults(found)
    })
    return () => {
      cancelled = true
    }
  }, [query])

  const grouped = groupByGroup(results)

  return (
    <>
      <button type="button" className="global-search" onClick={() => setOpen(true)}>
        <SearchIcon />
        <span className="global-search-label">{t('search.placeholder')}</span>
        <kbd>⌘K</kbd>
      </button>

      {open ? (
        <div className="search-palette-layer">
          <button
            type="button"
            className="search-palette-backdrop"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          />
          <div className="search-palette" role="dialog" aria-modal="true">
            <div className="search-palette-field">
              <SearchIcon />
              <input
                ref={inputRef}
                type="search"
                value={query}
                placeholder={t('search.placeholder')}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="search-palette-results">
              {grouped.length === 0 ? (
                <p className="search-palette-empty">
                  {query ? t('search.empty') : t('search.hint')}
                </p>
              ) : (
                grouped.map(([group, entries]) => (
                  <section key={group}>
                    <h3>{group}</h3>
                    {entries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          entry.run?.()
                          setOpen(false)
                        }}
                      >
                        <span>{entry.title}</span>
                        {entry.subtitle ? <small>{entry.subtitle}</small> : null}
                      </button>
                    ))}
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function groupByGroup(results) {
  const groups = new Map()
  for (const result of results) {
    const key = result.group ?? 'Results'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(result)
  }
  return [...groups.entries()]
}

export default GlobalSearch
