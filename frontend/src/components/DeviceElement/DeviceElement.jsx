import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { AdditiveBlending } from 'three'
import { glowTexture } from './glow-texture'
import {
  ACCENT_MATERIAL,
  BASE_MATERIAL,
  DEFAULT_ACCENT,
  DEFAULT_HOUSING,
  elementType,
  modelUrl,
} from './element-types'
import { useElementAnimation } from './useElementAnimation'

/**
 * One input-device element inside a three.js scene.
 *
 * This is the base every element type shares - it knows nothing about which
 * element it is showing beyond the registry entry it is handed, so a new type
 * needs no change here.
 *
 * It renders no canvas of its own. That is what lets the same component serve
 * both the palette (one small canvas per element, see ElementCard) and the
 * later device editor, where every element of a device lives in a single
 * shared canvas.
 *
 * @param typeId  key into ELEMENT_TYPES; unknown ids fall back to the placeholder
 * @param accent  colour for the part the user interacts with
 * @param playRef ref that receives the play() function, so a DOM click outside
 *                the canvas can trigger the animation
 */
export function DeviceElement({
  typeId,
  accent = DEFAULT_ACCENT,
  housing = DEFAULT_HOUSING,
  playRef,
  ...groupProps
}) {
  const type = elementType(typeId)
  const { scene } = useGLTF(modelUrl(type.id))
  const rootRef = useRef(null)
  const lightRef = useRef(null)
  const glowRef = useRef(null)
  const animation = useElementAnimation(type.motion)

  // Every instance needs its own copy: three shares geometry and materials
  // between clones, so without this a second key on the canvas would inherit
  // the first one's accent colour and LED state.
  const instance = useMemo(() => {
    const model = scene.clone(true)
    const materials = new Map()

    model.traverse((object) => {
      if (!object.material) return
      const cloned = Array.isArray(object.material)
        ? object.material.map((material) => material.clone())
        : object.material.clone()
      object.material = cloned
      for (const material of Array.isArray(cloned) ? cloned : [cloned]) {
        materials.set(material.name, material)
      }
    })

    return {
      model,
      materials,
      part: type.part ? model.getObjectByName(type.part) : null,
      animated: type.material ? materials.get(type.material) : null,
    }
  }, [scene, type.part, type.material])

  useLayoutEffect(() => {
    animation.bind({
      root: rootRef.current,
      part: instance.part,
      material: instance.animated,
      light: lightRef.current,
      glow: glowRef.current,
    })
  }, [animation, instance])

  // The models ship a placeholder accent colour; the real one is an app-wide
  // setting, so it is applied here rather than baked into the exports.
  useLayoutEffect(() => {
    const highlight = instance.materials.get(ACCENT_MATERIAL)
    if (highlight) highlight.color.set(accent)

    // The models ship the housing at near-black, which disappears into a dark
    // page and looks like a hole in a light one. It follows the theme instead.
    const base = instance.materials.get(BASE_MATERIAL)
    if (base) base.color.set(housing)

    const emissive = instance.animated
    if (emissive?.emissive) {
      emissive.emissive.set(accent)
      emissive.emissiveIntensity = 0   // an LED starts off
      // Tone mapping pulls bright values back towards the rest of the scene,
      // which is right for lit surfaces and wrong for something that is meant
      // to read as a light source.
      emissive.toneMapped = false
    }
  }, [accent, housing, instance])

  useEffect(() => {
    if (!playRef) return undefined
    playRef.current = animation.play
    return () => {
      playRef.current = null
    }
  }, [animation, playRef])

  return (
    <group ref={rootRef} {...groupProps}>
      <primitive object={instance.model} />
      {type.motion.kind === 'glow' ? (
        <>
          <pointLight
            ref={lightRef}
            position={[0, 0.008, 0]}
            intensity={0}
            distance={0.05}
            decay={2}
            color={accent}
          />
          {/* The halo. Additive so it brightens whatever is behind it instead
              of covering it, and depth-write off so it never hides the lens. */}
          <sprite ref={glowRef} position={[0, 0.008, 0]} scale={[0.02, 0.02, 0.02]}>
            <spriteMaterial
              map={glowTexture()}
              color={accent}
              transparent
              opacity={0}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        </>
      ) : null}
    </group>
  )
}

export default DeviceElement
