import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import {
  ACCENT_MATERIAL,
  DEFAULT_ACCENT,
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
  playRef,
  ...groupProps
}) {
  const type = elementType(typeId)
  const { scene } = useGLTF(modelUrl(type.id))
  const rootRef = useRef(null)
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
    })
  }, [animation, instance])

  // The models ship a placeholder accent colour; the real one is an app-wide
  // setting, so it is applied here rather than baked into the exports.
  useLayoutEffect(() => {
    const highlight = instance.materials.get(ACCENT_MATERIAL)
    if (highlight) highlight.color.set(accent)

    const emissive = instance.animated
    if (emissive?.emissive) {
      emissive.emissive.set(accent)
      emissive.emissiveIntensity = 0   // an LED starts off
    }
  }, [accent, instance])

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
    </group>
  )
}

export default DeviceElement
