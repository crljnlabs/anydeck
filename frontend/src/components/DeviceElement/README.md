# DeviceElement

The 3D input-device elements: keys, knobs, sliders, switches, LEDs. Each one
loads a glTF model from `public/models/` and plays its own motion on click.

```jsx
import { ElementCard, DeviceBoard, gridLayout, RotaryEncoder } from './components/DeviceElement'

<RotaryEncoder />                                  // named, one per model
<ElementCard typeId="keycap-standard-1u" />        // same thing, type as data
<DeviceBoard elements={gridLayout(ids)} menu={items} />
```

## The three layers

| | what it is | when to use it |
|---|---|---|
| `DeviceElement` | the model plus its animation, no canvas | inside a canvas you already have |
| `ElementCard` | one element on its own small canvas, in a clickable DOM box | palettes, pickers, single elements |
| `DeviceBoard` | many elements sharing **one** canvas | a device: several elements at once |

The split between the last two is not cosmetic. A browser keeps only around 16
live WebGL contexts and silently drops the oldest when that is exceeded, which
looks like elements rendering blank for no reason. One canvas per element is
fine for a palette of ten; it is not fine for a palette *and* a device on the
same screen. `DeviceBoard` exists for that case.

## Adding an element type

1. Model and export it (see `assets/3d-files/`), naming the moving part as in
   the table below.
2. `python3 scripts/models.py` — copies the export into `public/models/`.
3. Add an entry to `element-types.js`.
4. Add one component to `element-components.jsx` and one line to
   `element-registry.js`.

No change to the animation code is needed; `useElementAnimation` is driven
entirely by the registry entry.

## What the models have to provide

Object and material names are a contract between Blender and this code. The
current set:

| Element | Moving part | Motion |
|---|---|---|
| `keycap-standard-1u`, `keycap-standard-2u` | `Cap` | presses 3.5 mm down and returns |
| `rotary-encoder` | `Knob` | turns 30° per click and stays |
| `potentiometer` | `Knob` | turns 36° per click and stays |
| `slider-fader` | `Handle` | slides ±12 mm along the track |
| `toggle-switch` | `Lever` | flips ±0.45 rad, latching |
| `joystick` | `Stick` | tilts and returns |
| `led-indicator` | `Lens` (`LED_Emissive`) | lights up, latching |
| `display-screen` | `ScreenSurface` | scale pulse, nothing moves |
| `default-placeholder` | — | scale pulse |

Every model also carries `Base_Housing` for the static parts, and every model
with a user-facing part carries `AccentMaterial`. The accent colour is applied
at runtime from the `accent` prop, so it is one app-wide setting rather than
something baked into each export.

## Motion

Motion is described as data, not code:

```js
motion: { kind: 'turn', mode: 'step', axis: 'y', amount: Math.PI / 6, duration: 260 }
```

`kind` is what changes — `move`, `turn`, `glow`, `pulse`. `mode` is how a click
plays back:

- **bounce** — travel out and return. A key press.
- **step** — add and stay. An encoder that keeps turning.
- **toggle** — alternate between the two sides. A latching switch, an LED.

`useElementAnimation` writes straight to the three.js objects from a
`useFrame` loop and holds no React state; a state update per frame would mean a
reconciliation sixty times a second for every element on the canvas. Every
frame is computed from the rest pose rather than from the previous frame, so a
dropped frame cannot make an element drift.

## Real-world scale

Models are in metres at true hardware size — a 1u key really is 18 mm. Elements
are deliberately not normalised to a common size, so a fader looks larger than
an LED, and `gridLayout`'s default 21 mm pitch is real key spacing. This is why
the canvases use `near: 0.001`: the default near plane of 0.1 would clip the
entire scene away.
