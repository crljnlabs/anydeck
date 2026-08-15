import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Box3, Vector3 } from 'three'
import { RadialMenu } from '../RadialMenu'
import { DeviceElement } from './DeviceElement'
import { DEFAULT_ACCENT } from './element-types'
import './device-element.css'

// Steep enough that a back row is not hidden behind the row in front of it,
// still angled enough to read as three-dimensional.
const CAMERA = { position: [0.035, 0.135, 0.125], fov: 32, near: 0.001, far: 4 }

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
export function DeviceBoard({
  elements,
  accent = DEFAULT_ACCENT,
  menu = null,
  onMenuSelect,
  height = 260,
}) {
  const [active, setActive] = useState(null)   // { key, anchor, radius }

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
      <div className="device-board" style={{ blockSize: `${height}px` }}>
        <Canvas camera={CAMERA} dpr={[1, 2]} gl={{ antialias: true }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[0.05, 0.12, 0.08]} intensity={2.6} />
          {/* Rim from behind: the housing is nearly black, so without it a
              key reads as a floating cap with nothing underneath. */}
          <directionalLight position={[-0.08, 0.03, -0.09]} intensity={2.2} />
          <directionalLight position={[0.02, -0.05, 0.06]} intensity={0.5} />
          <Suspense fallback={null}>
            {elements.map((element) => (
              <BoardSlot
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
          radius={active.radius}
          items={menu}
          label={`${activeElement?.label ?? 'Element'} actions`}
          onSelect={(id, item) => onMenuSelect?.(id, item, activeElement)}
          onClose={close}
        />
      ) : null}
    </>
  )
}

function BoardSlot({ element, accent, selectable, onOpen }) {
  const groupRef = useRef(null)
  const playRef = useRef(null)
  const { camera, gl } = useThree()

  function handleClick(event) {
    // Only the frontmost element under the pointer should react, otherwise a
    // click also hits whatever is behind it.
    event.stopPropagation()
    playRef.current?.()
    if (selectable) onOpen({ key: element.key, ...ringFor(groupRef.current, camera, gl) })
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

const MIN_RING_RADIUS = 62
const RING_CLEARANCE = 34   // half an item button plus a little air

/**
 * Where to put the ring for an element, and how wide to make it.
 *
 * Centre: the middle of what the user sees, not the object's origin. An
 * element's origin sits on its mounting plane - the bottom - because that is
 * what makes elements line up on a board. Anchoring there puts the ring's
 * centre at the foot of a key, so the top entry lands on the key while the
 * bottom ones sit far out in empty space, even though every entry is the same
 * distance from the anchor.
 *
 * Radius: measured from the element rather than fixed, because elements differ
 * in size by a lot. A ring that clears a 1u key would sit on top of a 2u key
 * or a fader.
 *
 * Both come from the element's bounding box, projected corner by corner - the
 * centre of a projected box is not the projection of the box's centre once
 * perspective is involved.
 */
function ringFor(object, camera, gl) {
  const bounds = new Box3().setFromObject(object)
  const canvas = gl.domElement.getBoundingClientRect()
  const corner = new Vector3()

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (let i = 0; i < 8; i++) {
    corner.set(
      i & 1 ? bounds.max.x : bounds.min.x,
      i & 2 ? bounds.max.y : bounds.min.y,
      i & 4 ? bounds.max.z : bounds.min.z,
    )
    corner.project(camera)
    const x = canvas.left + (corner.x * 0.5 + 0.5) * canvas.width
    const y = canvas.top + (-corner.y * 0.5 + 0.5) * canvas.height
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }

  const reach = Math.max(maxX - minX, maxY - minY) / 2 + RING_CLEARANCE

  return {
    anchor: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
    radius: Math.max(MIN_RING_RADIUS, reach),
  }
}

export default DeviceBoard
