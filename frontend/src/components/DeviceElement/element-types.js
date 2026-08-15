/**
 * Every input-device element type the visual editor knows about.
 *
 * This registry is the single place that describes an element: which model to
 * load, which object inside it moves, and how it moves. Adding a new element
 * type means adding one entry here and one three-line component in
 * `element-components.jsx` - no changes to the animation code or the menu.
 *
 * The names below are not invented, they are the object and material names
 * baked into the .glb files (see assets/3d-files/). Keep them in sync when a
 * model is re-exported.
 *
 * Units are metres, matching the real hardware: a 1u keycap really is 18 mm
 * wide. Elements are deliberately NOT normalised to a common size - a fader
 * has to look larger than an LED when they sit next to each other.
 */

const MODEL_BASE = `${import.meta.env.BASE_URL}models/`

/**
 * How a click is played back:
 *
 *   bounce  travel to `amount` and return - a momentary press or nudge
 *   step    add `amount` and stay there - a knob that keeps turning
 *   toggle  alternate between -`amount` and +`amount` - a switch that latches
 *
 * `kind` decides what the value is applied to:
 *
 *   move    position of `part` along `axis`, in metres
 *   turn    rotation of `part` around `axis`, in radians
 *   glow    emissiveIntensity of `material`
 *   pulse   scale of the whole element - fallback for parts that do not move
 */
export const ELEMENT_TYPES = {
  'keycap-standard-1u': {
    id: 'keycap-standard-1u',
    label: 'Key 1u',
    description: 'Standard single-width key.',
    part: 'Cap',
    motion: { kind: 'move', mode: 'bounce', axis: 'y', amount: -0.0035, duration: 130 },
  },

  'keycap-standard-2u': {
    id: 'keycap-standard-2u',
    label: 'Key 2u',
    description: 'Double-width key, e.g. a space or enter position.',
    part: 'Cap',
    motion: { kind: 'move', mode: 'bounce', axis: 'y', amount: -0.0035, duration: 130 },
  },

  'rotary-encoder': {
    id: 'rotary-encoder',
    label: 'Rotary encoder',
    description: 'Endless knob, turns in detents.',
    part: 'Knob',
    // Steps instead of returning: an encoder that snapped back would read as a
    // button rather than as something that keeps turning.
    motion: { kind: 'turn', mode: 'step', axis: 'y', amount: Math.PI / 6, duration: 260 },
  },

  potentiometer: {
    id: 'potentiometer',
    label: 'Potentiometer',
    description: 'Knob with a limited range and a position indicator.',
    part: 'Knob',
    motion: { kind: 'turn', mode: 'step', axis: 'y', amount: Math.PI / 5, duration: 300 },
  },

  'slider-fader': {
    id: 'slider-fader',
    label: 'Slider',
    description: 'Linear fader travelling along its track.',
    part: 'Handle',
    motion: { kind: 'move', mode: 'toggle', axis: 'x', amount: 0.012, duration: 380 },
  },

  'toggle-switch': {
    id: 'toggle-switch',
    label: 'Toggle switch',
    description: 'Latching lever with two positions.',
    part: 'Lever',
    // The lever hinges at its own base, so rotating the node is enough - no
    // pivot correction needed here.
    motion: { kind: 'turn', mode: 'toggle', axis: 'z', amount: 0.45, duration: 220 },
  },

  joystick: {
    id: 'joystick',
    label: 'Joystick',
    description: 'Stick tilting around a pivot above the base.',
    part: 'Stick',
    motion: { kind: 'turn', mode: 'bounce', axis: 'x', amount: 0.35, duration: 420 },
  },

  'led-indicator': {
    id: 'led-indicator',
    label: 'LED',
    description: 'Indicator light, switched rather than moved.',
    part: 'Lens',
    material: 'LED_Emissive',
    // Needs to be well above 1: the renderer tone-maps bright values down, so
    // an intensity of 1 is barely distinguishable from the unlit lens.
    motion: { kind: 'glow', mode: 'toggle', amount: 6, duration: 200 },
  },

  'display-screen': {
    id: 'display-screen',
    label: 'Display',
    description: 'Small screen. The surface can take a texture later.',
    part: 'ScreenSurface',
    material: 'ScreenSurface',
    // Nothing on a screen moves, but a click still needs to feel answered.
    motion: { kind: 'pulse', mode: 'bounce', amount: 0.05, duration: 220 },
  },

  'default-placeholder': {
    id: 'default-placeholder',
    label: 'Unknown element',
    description: 'Stand-in for an element whose type is not known yet.',
    part: null,
    motion: { kind: 'pulse', mode: 'bounce', amount: 0.05, duration: 220 },
  },
}

/** Material carrying the user-facing colour in every model that has one. */
export const ACCENT_MATERIAL = 'AccentMaterial'

/** Fallback colour until the app has a real accent setting. */
export const DEFAULT_ACCENT = '#f97316'

export const ELEMENT_TYPE_LIST = Object.values(ELEMENT_TYPES)

export const ELEMENT_TYPE_IDS = Object.keys(ELEMENT_TYPES)

export function modelUrl(id) {
  return `${MODEL_BASE}${id}.glb`
}

/**
 * Look up a type, falling back to the placeholder. An unknown type is a normal
 * situation - it is what a freshly detected, unclassified element looks like -
 * so it must not throw.
 */
export function elementType(id) {
  return ELEMENT_TYPES[id] ?? ELEMENT_TYPES['default-placeholder']
}
