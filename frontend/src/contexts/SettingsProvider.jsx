import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './settings-context'
import { DEFAULT_APPEARANCE, accentColor, applyAppearance } from '../theme/appearance'
import { DEFAULT_LANGUAGE, translate } from '../i18n/translations'

const DEFAULTS = { ...DEFAULT_APPEARANCE, language: DEFAULT_LANGUAGE }

/**
 * The settings the whole interface reads: theme, accent, language.
 *
 * The backend owns them, because they have to survive a restart and because the
 * device listener will eventually want the same values. The interface applies a
 * change immediately and sends it afterwards, so the UI never waits on a round
 * trip - and a failed save leaves the app usable rather than stuck.
 */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/settings')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setSettings({ ...DEFAULTS, ...data })
      })
      // The window has to work even with no backend behind it - during frontend
      // development there may not be one running.
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    applyAppearance(settings)
  }, [settings])

  const update = useCallback((change) => {
    setSettings((current) => ({ ...current, ...change }))

    fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(change),
    }).catch(() => {})
  }, [])

  const value = useMemo(
    () => ({
      ...settings,
      loaded,
      accentColor: accentColor(settings.accent),
      update,
      t: (key) => translate(settings.language, key),
    }),
    [settings, loaded, update],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
