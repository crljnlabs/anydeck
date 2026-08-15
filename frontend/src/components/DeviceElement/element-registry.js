import { useGLTF } from '@react-three/drei'
import {
  Keycap1u,
  Keycap2u,
  RotaryEncoder,
  Potentiometer,
  SliderFader,
  ToggleSwitch,
  Joystick,
  LedIndicator,
  DisplayScreen,
  UnknownElement,
} from './element-components'
import { ELEMENT_TYPE_IDS, modelUrl } from './element-types'

/**
 * Runtime lookup from a type id to its component, for the case the app will
 * spend most of its time in: elements read out of the database, where the type
 * is a string and not something the code can name at build time.
 */
export const ELEMENT_COMPONENTS = {
  'keycap-standard-1u': Keycap1u,
  'keycap-standard-2u': Keycap2u,
  'rotary-encoder': RotaryEncoder,
  potentiometer: Potentiometer,
  'slider-fader': SliderFader,
  'toggle-switch': ToggleSwitch,
  joystick: Joystick,
  'led-indicator': LedIndicator,
  'display-screen': DisplayScreen,
  'default-placeholder': UnknownElement,
}

/**
 * An element of unknown type still has to render - that is the normal state of
 * a freshly detected device - so this never returns undefined.
 */
export function elementComponent(typeId) {
  return ELEMENT_COMPONENTS[typeId] ?? UnknownElement
}

/**
 * Pull every model into the drei cache up front. The files are local and small
 * (8-51 KB), so this is one short burst at startup in exchange for no pop-in
 * when the element palette is first opened.
 */
export function preloadElementModels() {
  for (const id of ELEMENT_TYPE_IDS) useGLTF.preload(modelUrl(id))
}
