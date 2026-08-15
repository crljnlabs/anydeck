/**
 * Interface strings.
 *
 * A plain object rather than an i18n library: the app is small, ships offline,
 * and needs no plurals, dates or interpolation yet. When it does, this file is
 * the thing that gets replaced - every component already reads through `t()`,
 * so nothing else has to change.
 *
 * English is the fallback: a key missing from a translation falls back to the
 * English string rather than showing the raw key to the user.
 */

export const LANGUAGES = {
  en: { id: 'en', label: 'English' },
  de: { id: 'de', label: 'Deutsch' },
}

export const LANGUAGE_IDS = Object.keys(LANGUAGES)

export const DEFAULT_LANGUAGE = 'en'

const strings = {
  en: {
    'app.name': 'anydeck',
    'nav.home': 'Home',
    'nav.settings': 'Settings',
    'nav.collapse': 'Collapse sidebar',
    'nav.expand': 'Expand sidebar',
    'search.placeholder': 'Search',
    'search.empty': 'Search is not wired up yet',
    'search.hint': 'Devices, elements and actions will show up here',
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.theme.system': 'System',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.accent': 'Accent',
    'settings.language': 'Language',
    'settings.languageHint': 'Applies immediately, no restart needed',
    'home.title': 'Home',
    'home.hint': 'Scratch space for trying things out',
    'user.signedInAs': 'Signed in as',
    'user.osAccount': 'Operating-system account',
  },
  de: {
    'app.name': 'anydeck',
    'nav.home': 'Start',
    'nav.settings': 'Einstellungen',
    'nav.collapse': 'Seitenleiste einklappen',
    'nav.expand': 'Seitenleiste ausklappen',
    'search.placeholder': 'Suchen',
    'search.empty': 'Die Suche ist noch nicht angebunden',
    'search.hint': 'Geräte, Elemente und Aktionen erscheinen hier',
    'settings.title': 'Einstellungen',
    'settings.appearance': 'Darstellung',
    'settings.theme': 'Erscheinungsbild',
    'settings.theme.system': 'System',
    'settings.theme.light': 'Hell',
    'settings.theme.dark': 'Dunkel',
    'settings.accent': 'Akzentfarbe',
    'settings.language': 'Sprache',
    'settings.languageHint': 'Wirkt sofort, kein Neustart nötig',
    'home.title': 'Start',
    'home.hint': 'Spielwiese zum Ausprobieren',
    'user.signedInAs': 'Angemeldet als',
    'user.osAccount': 'Benutzerkonto des Betriebssystems',
  },
}

export function translate(language, key) {
  return strings[language]?.[key] ?? strings[DEFAULT_LANGUAGE][key] ?? key
}
