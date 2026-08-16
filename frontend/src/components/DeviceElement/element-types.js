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
    kind: 'input',
    triggers: ['press', 'release', 'hold'],
    size: [0.018, 0.0185, 0.018],
    span: [4, 4],
    resizable: false,
    label: 'Key 1u',
    description: 'Standard single-width key.',
    part: 'Cap',
    motion: { kind: 'move', mode: 'bounce', axis: 'y', amount: -0.0035, duration: 130 },
  },

  'keycap-standard-2u': {
    id: 'keycap-standard-2u',
    kind: 'input',
    triggers: ['press', 'release', 'hold'],
    size: [0.0371, 0.0185, 0.018],
    span: [8, 4],
    resizable: false,
    label: 'Key 2u',
    description: 'Double-width key, e.g. a space or enter position.',
    part: 'Cap',
    motion: { kind: 'move', mode: 'bounce', axis: 'y', amount: -0.0035, duration: 130 },
  },

  'keycap-standard-6-25u': {
    id: 'keycap-standard-6-25u',
    kind: 'input',
    triggers: ['press', 'release', 'hold'],
    size: [0.118, 0.0185, 0.018],
    span: [25, 4],
    resizable: false,
    label: 'Key 6.25u',
    description: 'Spacebar-width key.',
    part: 'Cap',
    motion: { kind: 'move', mode: 'bounce', axis: 'y', amount: -0.0035, duration: 130 },
  },

  'rotary-encoder': {
    id: 'rotary-encoder',
    kind: 'input',
    triggers: ['turn-left', 'turn-right', 'press', 'release'],
    size: [0.0158, 0.0215, 0.0156],
    span: [4, 4],
    resizable: false,
    label: 'Rotary encoder',
    description: 'Endless knob, turns in detents.',
    part: 'Knob',
    // Steps instead of returning: an encoder that snapped back would read as a
    // button rather than as something that keeps turning.
    motion: { kind: 'turn', mode: 'step', axis: 'y', amount: Math.PI / 6, duration: 260 },
  },

  potentiometer: {
    id: 'potentiometer',
    kind: 'input',
    triggers: ['change'],
    span: [4, 4],
    resizable: false,
    label: 'Potentiometer',
    description: 'Knob with a limited range and a position indicator.',
    part: 'Knob',
    motion: { kind: 'turn', mode: 'step', axis: 'y', amount: Math.PI / 5, duration: 300 },
  },

  'slider-fader': {
    id: 'slider-fader',
    kind: 'input',
    triggers: ['change'],
    size: [0.0455, 0.014, 0.0095],
    span: [10, 2],
    resizable: true,
    label: 'Slider',
    description: 'Linear fader travelling along its track.',
    part: 'Handle',
    motion: { kind: 'move', mode: 'toggle', axis: 'x', amount: 0.012, duration: 380 },
  },

  'toggle-switch': {
    id: 'toggle-switch',
    kind: 'input',
    triggers: ['on', 'off'],
    size: [0.013, 0.023, 0.008],
    span: [3, 2],
    resizable: false,
    label: 'Toggle switch',
    description: 'Latching lever with two positions.',
    part: 'Lever',
    // The lever hinges at its own base, so rotating the node is enough - no
    // pivot correction needed here.
    motion: { kind: 'turn', mode: 'toggle', axis: 'z', amount: 0.45, duration: 220 },
  },

  joystick: {
    id: 'joystick',
    kind: 'input',
    triggers: ['move', 'press'],
    span: [4, 4],
    resizable: false,
    label: 'Joystick',
    description: 'Stick tilting around a pivot above the base.',
    part: 'Stick',
    motion: { kind: 'turn', mode: 'bounce', axis: 'x', amount: 0.35, duration: 420 },
  },

  'led-indicator': {
    id: 'led-indicator',
    kind: 'output',
    triggers: [],
    size: [0.01, 0.009, 0.01],
    span: [1, 1],
    resizable: false,
    label: 'LED',
    description: 'Indicator light, switched rather than moved.',
    part: 'Lens',
    material: 'LED_Emissive',
    // Above 1, but not so far that the lens clips to white and loses its
    // colour. The rest of the impression comes from the light it casts.
    motion: { kind: 'glow', mode: 'toggle', amount: 7, duration: 200 },
  },

  'display-screen': {
    id: 'display-screen',
    kind: 'output',
    triggers: [],
    size: [0.03, 0.0035, 0.022],
    span: [7, 5],
    resizable: true,
    label: 'Display',
    description: 'Small screen. The surface can take a texture later.',
    part: 'ScreenSurface',
    material: 'ScreenSurface',
    // Nothing on a screen moves, but a click still needs to feel answered.
    motion: { kind: 'pulse', mode: 'bounce', amount: 0.05, duration: 220 },
  },

  'default-placeholder': {
    id: 'default-placeholder',
    kind: 'input',
    triggers: [],
    size: [0.018, 0.012, 0.018],
    span: [4, 4],
    resizable: false,
    label: 'Unknown element',
    description: 'Stand-in for an element whose type is not known yet.',
    part: null,
    motion: { kind: 'pulse', mode: 'bounce', amount: 0.05, duration: 220 },
  },
}

/**
 * `kind` splits the set in two, and it matters for the data model: an input
 * reports to the PC and can therefore have actions hung off it, while an output
 * is driven by the PC and has state pushed to it. An LED fires no triggers - it
 * is told when to light up. `triggers` lists what an input can report.
 *
 * `size` is the model's real bounding box in metres, measured from the export
 * rather than assumed. It is not the same thing as `span`: a span is rounded up
 * to whole grid cells and says how much room an element claims on a board, a
 * size says how large it actually is. An LED claims one 4.75 mm cell and is a
 * 10 mm blob; the two numbers cannot be derived from each other.
 *
 * Every model is centred on x and z, so only half the height is needed to
 * centre one in a view.
 */

/** Material carrying the user-facing colour in every model that has one. */
export const ACCENT_MATERIAL = 'AccentMaterial'

/** Material of the static housing, present in every model. */
export const BASE_MATERIAL = 'Base_Housing'

/** Fallbacks for use outside the app, e.g. a component rendered on its own. */
export const DEFAULT_ACCENT = '#f97316'
export const DEFAULT_HOUSING = '#3a3f49'

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
