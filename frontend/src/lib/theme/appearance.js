/**
 * Theme and accent, for the whole app.
 *
 * These used to live inside AnydeckIcon, which was the only thing that had an
 * opinion about them. Now they are an app-wide setting the icon reads like
 * everything else does, so the settings screen has one place to bind to.
 */

export const THEMES = ['system', 'light', 'dark']

/**
 * Named accents. The colour is here rather than only in CSS because three
 * separate consumers need the actual value: the settings swatches, the CSS
 * custom property, and the 3D elements, which set it on a material.
 */
export const ACCENTS = {
  orange: { id: 'orange', color: '#f97316' },
  blue: { id: 'blue', color: '#3b82f6' },
  gold: { id: 'gold', color: '#eab308' },
  mint: { id: 'mint', color: '#10b981' },
}

export const ACCENT_IDS = Object.keys(ACCENTS)

export const DEFAULT_APPEARANCE = { theme: 'system', accent: 'orange' }

export function accentColor(accent) {
  // An unknown accent must still render - a stale stored value should not blank
  // the interface out.
  return ACCENTS[accent]?.color ?? ACCENTS.orange.color
}

/**
 * Colours for the 3D elements, which need different values than flat UI does.
 *
 * The housing is the part that has to change with the theme. The models ship it
 * at #2a2b30, which sits almost exactly on a dark page background - the element
 * then reads as a floating cap with nothing under it. On a light page the same
 * near-black looks like a hole punched in the page, so it warms to a cream that
 * belongs to the surface it sits on.
 *
 * The accent is dimmed a little for the 3D use. A colour picked to be legible
 * as a flat swatch is too loud on a lit, curved surface, where highlights push
 * it further towards white.
 */
export const ELEMENT_HOUSING = {
  dark: '#3a3f49',
  light: '#ded8cb',
}

export function elementPalette(resolvedTheme, accent) {
  return {
    accent: dim(accentColor(accent), 0.86),
    housing: ELEMENT_HOUSING[resolvedTheme] ?? ELEMENT_HOUSING.dark,
  }
}

/** Scale a hex colour towards black. */
function dim(hex, factor) {
  const value = parseInt(hex.slice(1), 16)
  const channel = (shift) =>
    Math.round(Math.min(255, ((value >> shift) & 0xff) * factor))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(16)}${channel(8)}${channel(0)}`
}



/**
 * Push the appearance onto the document.
 *
 * `data-theme` drives `color-scheme`, which is what every `light-dark()` in the
 * stylesheets resolves through - so one attribute switches the entire palette
 * without a single component knowing which theme is active. `system` sets no
 * attribute at all and lets the OS decide.
 */
export function applyAppearance({ theme, accent }) {
  const root = document.documentElement

  if (theme === 'light' || theme === 'dark') {
    root.dataset.theme = theme
  } else {
    delete root.dataset.theme
  }

  root.style.setProperty('--accent', accentColor(accent))
}
