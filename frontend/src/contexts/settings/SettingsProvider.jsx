import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './settings-context'
import {
  DEFAULT_APPEARANCE,
  accentColor,
  applyAppearance,
  elementPalette,
} from '../../lib/theme/appearance'
import { DEFAULT_LANGUAGE, translate } from '../../lib/i18n'

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
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  )

  // `system` has to follow the OS while the app is open, not only at startup.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!query) return undefined
    const onChange = (event) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

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

  const value = useMemo(() => {
    // Resolved from state rather than by reading the media query in here, so
    // the dependency on the OS setting is visible instead of hidden in a call.
    const resolvedTheme =
      settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme
    return {
      ...settings,
      loaded,
      resolvedTheme,
      accentColor: accentColor(settings.accent),
      // Colours for the 3D elements, which need dimmer values than flat UI.
      element: elementPalette(resolvedTheme, settings.accent),
      update,
      t: (key) => translate(settings.language, key),
    }
  }, [settings, loaded, systemDark, update])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
