import { DEFAULT_LANGUAGE } from './languages'
import { strings } from './translations'

/** Look up a string, falling back to English, then to the key itself. Showing
 *  a raw key is ugly but debuggable; showing nothing is neither. */
export function translate(language, key) {
  return strings[language]?.[key] ?? strings[DEFAULT_LANGUAGE][key] ?? key
}
