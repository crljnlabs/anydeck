import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Box3, Vector3 } from 'three'
import { useSettings } from '../../contexts/settings'
import { RadialMenu } from '../RadialMenu'
import { DeviceElement } from '../DeviceElement'
import { CELL_PITCH, gridExtent } from './element-layout'
import './device-board.scss'

// Viewing angle above the board. Steep enough that every element is readable
// on its own and no row hides behind the one in front of it - at a shallow
// angle a dense grid turns into a wall of overlapping caps.
const ELEVATION = (55 * Math.PI) / 180

// Tallest element in the set, roughly - a knob at 21 mm. Used to reserve
// vertical room so nothing is cropped at the top.
const ELEMENT_HEIGHT = 0.022

// Elements stand on y = 0, so the scene is dropped by half an element to sit
// in the middle of the view rather than in its upper half.
const SCENE_OFFSET = [0, -ELEMENT_HEIGHT / 2, 0]

/**
 * A whole device on one shared canvas.
 *
 * Two things separate this from ElementCard. It uses a single WebGL context -
 * a browser keeps only around sixteen alive and silently drops the oldest,
 * which shows up as elements rendering blank. And it sizes itself to its
 * contents: the surface is the device, so it grows with the grid instead of
 * stretching across whatever width is available.
 *
 * The camera is orthographic on purpose. A device layout is a technical
 * drawing, not a photograph: with no perspective, a key in the far corner is
 * drawn at exactly the same size as one in the middle, one grid cell is always
 * `cellSize` pixels, and the projection used to place the action ring is exact.
 *
 * @param elements    from gridLayout(): each has cell, span and position
 * @param interactive false renders the device as a picture - no clicks, no
 *                    animation, no menu. For anywhere a device is shown rather
 *                    than edited.
 * @param menu        entries for the ring, or null for none
 */
export function DeviceBoard({
  elements,
  accent,
  housing,
  menu = null,
  onMenuSelect,
  interactive = true,
  cellSize = 20,   // pixels per cell; a 1u key is 4 cells, so 80 px
  padding = 26,
}) {
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])
  // Colours follow the app theme unless a caller overrides them.
  const { element } = useSettings()

  const { columns, rows } = gridExtent(elements)

  // Pixels per metre. Fixing this rather than fitting a camera to the content
  // is what keeps a cell the same size whether the device has four elements or
  // forty - two devices side by side stay comparable.
  const zoom = cellSize / CELL_PITCH

  const width = columns * cellSize + padding * 2
  const height =
    rows * cellSize * Math.sin(ELEVATION) +
    ELEMENT_HEIGHT * zoom * Math.cos(ELEVATION) +
    padding * 2

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
      <div
        className="device-board"
        data-interactive={interactive}
        style={{ inlineSize: `${Math.round(width)}px`, blockSize: `${Math.round(height)}px` }}
      >
        <Canvas
          orthographic
          camera={{
            zoom,
            position: [0, Math.sin(ELEVATION), Math.cos(ELEVATION)],
            near: -10,
            far: 10,
          }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          {/* Softer than it was: a key light strong enough to model the shape
              also drives the accent towards white on curved surfaces. */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[0.05, 0.12, 0.08]} intensity={1.5} />
          <directionalLight position={[-0.08, 0.03, -0.09]} intensity={1.1} />
          <directionalLight position={[0.02, -0.05, 0.06]} intensity={0.4} />
          <Suspense fallback={null}>
            <group position={SCENE_OFFSET}>
              {elements.map((item) => (
                <BoardSlot
                  key={item.key}
                  element={item}
                  accent={accent ?? element.accent}
                  housing={housing ?? element.housing}
                  interactive={interactive}
                  selectable={interactive && Boolean(menu?.length)}
                  onOpen={setActive}
                />
              ))}
            </group>
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

function BoardSlot({ element, accent, housing, interactive, selectable, onOpen }) {
  const groupRef = useRef(null)
  const playRef = useRef(null)
  const { camera, gl } = useThree()

  function handleClick(event) {
    // Only the frontmost element under the pointer reacts, otherwise the click
    // also hits whatever is behind it.
    event.stopPropagation()
    playRef.current?.()
    if (selectable) onOpen({ key: element.key, ...ringFor(groupRef.current, camera, gl) })
  }

  const handlers = interactive
    ? {
        onClick: handleClick,
        onPointerOver: () => (gl.domElement.style.cursor = 'pointer'),
        onPointerOut: () => (gl.domElement.style.cursor = 'auto'),
      }
    : {}

  return (
    <group ref={groupRef} position={element.position} {...handlers}>
      <DeviceElement
        typeId={element.typeId}
        accent={accent}
        housing={housing}
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
 * in size by a lot. A ring that clears a 1u key would sit on top of a fader.
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
