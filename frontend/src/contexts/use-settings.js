import { useContext } from 'react'
import { SettingsContext } from './settings-context'

/** Theme, accent, language, and the translation function, for any component. */
export function useSettings() {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used inside a SettingsProvider')
  return value
}

/** Shorthand for components that only need to translate. */
export function useTranslation() {
  return useSettings().t
}
