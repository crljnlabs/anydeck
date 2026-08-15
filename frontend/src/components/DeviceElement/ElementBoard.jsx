import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { RadialMenu } from '../RadialMenu'
import { DeviceElement } from './DeviceElement'
import { DEFAULT_ACCENT } from './element-types'
import './device-element.css'

// Steep enough that a back row is not hidden behind the row in front of it,
// still angled enough to read as three-dimensional.
const CAMERA = { position: [0.035, 0.17, 0.105], fov: 32, near: 0.001, far: 4 }

/**
 * Several elements arranged on one shared canvas - a device, rather than a
 * palette of parts.
 *
 * The important difference to ElementCard is the single WebGL context. A
 * browser only keeps a limited number alive (around 16) and silently drops the
 * oldest ones when that is exceeded, which shows up as elements that render
 * blank. One canvas per element is fine for a palette; a device with a dozen
 * elements, next to a palette, is not.
 *
 * Positions are in metres, in the same real-world scale as the models, so a
 * 1u key really is 18 mm wide and elements can be laid out at the spacing the
 * physical hardware has.
 *
 * @param elements [{ key, typeId, position, label }]
 * @param menu     entries for the ring that opens on click, or null for none
 */
export function ElementBoard({
  elements,
  accent = DEFAULT_ACCENT,
  menu = null,
  onMenuSelect,
  height = 260,
}) {
  const [active, setActive] = useState(null)   // { key, anchor }

  const close = useCallback(() => setActive(null), [])

  // The ring lives in the DOM, in viewport coordinates, so it has to be
  // recomputed whenever the canvas moves under it.
  useEffect(() => {
    if (!active) return undefined
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [active, close])

  const activeElement = elements.find((element) => element.key === active?.key)

  return (
    <>
      <div className="element-board" style={{ blockSize: `${height}px` }}>
        <Canvas camera={CAMERA} dpr={[1, 2]} gl={{ antialias: true }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[0.05, 0.12, 0.08]} intensity={2.6} />
          <directionalLight position={[-0.08, 0.05, -0.06]} intensity={0.9} />
          <Suspense fallback={null}>
            {elements.map((element) => (
              <BoardElement
                key={element.key}
                element={element}
                accent={accent}
                selectable={Boolean(menu?.length)}
                onOpen={setActive}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {active && menu?.length ? (
        <RadialMenu
          anchor={active.anchor}
          items={menu}
          label={`${activeElement?.label ?? 'Element'} actions`}
          onSelect={(id, item) => onMenuSelect?.(id, item, activeElement)}
          onClose={close}
        />
      ) : null}
    </>
  )
}

function BoardElement({ element, accent, selectable, onOpen }) {
  const groupRef = useRef(null)
  const playRef = useRef(null)
  const { camera, gl } = useThree()

  function handleClick(event) {
    // Only the frontmost element under the pointer should react, otherwise a
    // click also hits whatever is behind it.
    event.stopPropagation()
    playRef.current?.()
    if (selectable) onOpen({ key: element.key, anchor: toScreen(groupRef.current, camera, gl) })
  }

  return (
    <group
      ref={groupRef}
      position={element.position}
      onClick={handleClick}
      onPointerOver={() => (gl.domElement.style.cursor = 'pointer')}
      onPointerOut={() => (gl.domElement.style.cursor = 'auto')}
    >
      <DeviceElement
        typeId={element.typeId}
        accent={accent}
        playRef={playRef}
      />
    </group>
  )
}

/** World position of an object -> viewport coordinates for the DOM menu. */
function toScreen(object, camera, gl) {
  const point = new Vector3().setFromMatrixPosition(object.matrixWorld)
  point.project(camera)
  const box = gl.domElement.getBoundingClientRect()
  return {
    x: box.left + (point.x * 0.5 + 0.5) * box.width,
    y: box.top + (-point.y * 0.5 + 0.5) * box.height,
  }
}

export default ElementBoard
