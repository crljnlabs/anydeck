import { useCallback, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Plays the click animation described by an entry in `element-types.js`.
 *
 * The hook owns no React state on purpose: a state update per frame would cost
 * a full reconciliation sixty times a second, for every element on the canvas.
 * Everything runs through refs and writes straight to the three.js objects,
 * the same trick AnydeckIcon uses for its SVG.
 *
 * Usage:
 *
 *     const animation = useElementAnimation(type.motion)
 *     animation.bind({ root, part, material })   // once the model is cloned
 *     animation.play()                           // on click
 */
export function useElementAnimation(motion) {
  const targets = useRef({ root: null, part: null, material: null, light: null })
  const rest = useRef(null)
  const state = useRef({
    value: 0,      // currently applied offset
    target: 0,     // where `value` is heading (step / toggle)
    phase: 1,      // 0..1 while a bounce is playing, 1 when finished
    latched: false,
    idle: true,
  })

  /**
   * Remember the untouched transform. Every frame is computed from this rather
   * than from the previous frame, so a dropped or long frame cannot make the
   * element drift away from where the model put it.
   */
  const bind = useCallback((next) => {
    const previous = targets.current
    targets.current = next
    const { root, part } = next

    // Re-measure when the objects actually change, not just once: an element
    // that switches type gets a different model, and a rest pose taken from
    // the old one would offset every animation from then on.
    const changed = previous.part !== part || previous.root !== root
    if ((changed || !rest.current) && (part || root)) {
      rest.current = {
        position: part ? part.position.clone() : null,
        rotation: part ? { x: part.rotation.x, y: part.rotation.y, z: part.rotation.z } : null,
        scale: root ? root.scale.x : 1,
      }
    }
  }, [])

  const play = useCallback(() => {
    const s = state.current
    s.idle = false

    if (motion.mode === 'bounce') {
      s.phase = 0
      return
    }

    if (motion.mode === 'step') {
      s.target += motion.amount
      return
    }

    // toggle: a glow is off or on, everything else swings to either side of
    // its resting position.
    s.latched = !s.latched
    if (motion.kind === 'glow') {
      s.target = s.latched ? motion.amount : 0
    } else {
      s.target = s.latched ? motion.amount : -motion.amount
    }
  }, [motion])

  useFrame((_, delta) => {
    const s = state.current
    if (s.idle) return

    const seconds = Math.max(motion.duration, 1) / 1000

    if (motion.mode === 'bounce') {
      s.phase = Math.min(1, s.phase + delta / seconds)
      // A half sine leaves and returns at exactly zero, so a press cannot end
      // slightly off its rest position.
      s.value = motion.amount * Math.sin(Math.PI * s.phase)
      if (s.phase >= 1) {
        s.value = 0
        s.idle = true
      }
    } else {
      // Exponential approach: frame-rate independent, and it settles without
      // the overshoot a spring would add to a knob detent.
      const tau = seconds / 3
      s.value += (s.target - s.value) * (1 - Math.exp(-delta / tau))
      if (Math.abs(s.target - s.value) < 1e-5) {
        s.value = s.target
        s.idle = true
      }
    }

    apply(motion, s.value, targets.current, rest.current)
  })

  // Stable identity: consumers put this in effect dependency lists, and a fresh
  // object every render would re-run them on every render.
  return useMemo(() => ({ bind, play }), [bind, play])
}

// A real lamp in a scene measured in millimetres needs a tiny number: three
// works in candela, and illuminance falls off with the square of a distance
// that is here about a centimetre.
const LIGHT_SCALE = 0.00009

function apply(motion, value, { root, part, material, light }, rest) {
  if (!rest) return

  switch (motion.kind) {
    case 'move':
      if (part) part.position[motion.axis] = rest.position[motion.axis] + value
      break

    case 'turn':
      if (part) part.rotation[motion.axis] = rest.rotation[motion.axis] + value
      break

    case 'glow':
      if (material) material.emissiveIntensity = Math.max(0, value)
      // The lens is 5 mm across - far too little area to look like a light
      // source on its own. What sells it is the housing around it lighting up.
      if (light) light.intensity = Math.max(0, value) * LIGHT_SCALE
      break

    case 'pulse':
      if (root) root.scale.setScalar(rest.scale * (1 + value))
      break

    default:
      break
  }
}
