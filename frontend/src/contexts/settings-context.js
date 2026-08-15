import { createContext } from 'react'

/** Kept apart from the provider so hooks and components can import it without
 *  pulling a component into a plain module. */
export const SettingsContext = createContext(null)
