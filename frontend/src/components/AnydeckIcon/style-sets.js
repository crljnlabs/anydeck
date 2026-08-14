/* The style sets the icon ships with — the shape a settings screen would bind
 * to. Both axes are plain data: `surface` picks the colour-scheme the tokens
 * resolve through, `accent` picks a named keycap palette. The `accent` prop
 * also takes any CSS colour, in which case the three companion shades are
 * mixed from it and no entry here is needed. */

export const SURFACE_SETS = ['auto', 'light', 'dark']

export const ACCENT_SETS = ['orange', 'blue', 'gold', 'mint']
