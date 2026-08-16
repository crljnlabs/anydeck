import { ElementCard } from '../ElementCard'

/**
 * One named component per model file.
 *
 * They exist so calling code reads as what it is - `<RotaryEncoder />` rather
 * than `<ElementCard typeId="rotary-encoder" />` - and so an editor can
 * autocomplete the available elements. All behaviour lives in ElementCard and
 * in `element-types.js`; these only pin the type and pass everything through.
 *
 * Written out one by one rather than generated from the registry: a generated
 * component has no name to jump to, and this file is meant to be the list you
 * read when you want to know which elements exist.
 *
 * Adding an element: export the model, run `python3 scripts/models.py`, add the
 * entry to `element-types.js`, then add one component here.
 */

export function Keycap1u(props) {
  return <ElementCard typeId="keycap-standard-1u" {...props} />
}

export function Keycap2u(props) {
  return <ElementCard typeId="keycap-standard-2u" {...props} />
}

export function Keycap625u(props) {
  return <ElementCard typeId="keycap-standard-6-25u" {...props} />
}

export function RotaryEncoder(props) {
  return <ElementCard typeId="rotary-encoder" {...props} />
}

export function Potentiometer(props) {
  return <ElementCard typeId="potentiometer" {...props} />
}

export function SliderFader(props) {
  return <ElementCard typeId="slider-fader" {...props} />
}

export function ToggleSwitch(props) {
  return <ElementCard typeId="toggle-switch" {...props} />
}

export function Joystick(props) {
  return <ElementCard typeId="joystick" {...props} />
}

export function LedIndicator(props) {
  return <ElementCard typeId="led-indicator" {...props} />
}

export function DisplayScreen(props) {
  return <ElementCard typeId="display-screen" {...props} />
}

/** Shown for an element whose type has not been identified yet. */
export function UnknownElement(props) {
  return <ElementCard typeId="default-placeholder" {...props} />
}
