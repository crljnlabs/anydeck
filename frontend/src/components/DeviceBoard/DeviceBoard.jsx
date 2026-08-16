import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Box3, Vector3 } from 'three'
import { useSettings } from '../../contexts/settings'
import { RadialMenu, ResizeIcon } from '../RadialMenu'
import { DeviceElement } from '../DeviceElement'
import { ElementBoundary } from '../DeviceElement/ElementBoundary'
import { ElementLights } from '../DeviceElement/ElementLights'
import { elementType } from '../DeviceElement/element-types'
import { SCENE_OFFSET, viewCamera } from '../DeviceElement/element-view'
import {
  CELL_PITCH,
  gridExtent,
  normaliseCells,
  placeWithinGrid,
  spanFor,
  withPositions,
} from './element-layout'
import { boardFrame } from './board-frame'
import { BoardGrid } from './BoardGrid'
import { DragHints } from './DragHints'
import { ResizeOverlay } from './ResizeOverlay'
import { useBoardDrag } from './useBoardDrag'
import { useBoardResize } from './useBoardResize'
import './device-board.scss'

/** Shown while an element is in hand. Nothing else is bound during a drag. */
const DRAG_HINTS = [
  { key: 'R', label: 'Rotate' },
  { key: 'Esc', label: 'Cancel' },
]

/** Shown while a footprint is being changed. */
const RESIZE_HINTS = [{ key: 'Esc', label: 'Cancel' }]

/**
 * Resizing is the board's own doing, not the caller's, the same way moving is.
 * The entry appears on the ring for elements that can take it and is handled
 * here rather than being passed out and handed back.
 */
const RESIZE_ITEM = {
  id: 'board:resize',
  label: 'Resize',
  icon: <ResizeIcon />,
}

/** How far an element lifts off the surface while it is being carried. */
const CARRY_LIFT = 0.006

/**
 * Spare cells added to the board while a footprint is being changed.
 *
 * A board is exactly as large as its contents, so an element at the edge has
 * nowhere to grow into: the first drag of its corner would be clamped after a
 * cell and the element would appear stuck. This is one key's worth of room to
 * work in, and it disappears again when the resize is over. It is added when
 * the mode is entered rather than mid-gesture, so the board is never resized
 * out from under a moving pointer.
 */
const RESIZE_HEADROOM = 4


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
 * @param elements       from gridLayout(): each has cell, span and position
 * @param interactive    false renders the device as a picture - no clicks, no
 *                       animation, no menu. For anywhere a device is shown
 *                       rather than edited.
 * @param menu           entries for the ring, or null for none
 * @param onLayoutChange called with { key, cell, rotation } when an element has
 *                       been moved. Leaving it out makes the board read-only:
 *                       nothing can be picked up, and no grid appears.
 */
export function DeviceBoard({
  elements,
  accent,
  housing,
  menu = null,
  onSelect,
  onMenuSelect,
  onLayoutChange,
  interactive = true,
  cellSize = 20,   // pixels per cell; a 1u key is 4 cells, so 80 px
  padding = 26,
}) {
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])
  // Resizing works from pointer positions on the page, so it needs to know
  // where the board itself is.
  const boardRef = useRef(null)
  // Colours follow the app theme unless a caller overrides them.
  const { element } = useSettings()

  // Which element the ring was asked to resize. Held here rather than inside
  // the gesture, because the board has to make room for it before the gesture
  // can start.
  const [resizingKey, setResizingKey] = useState(null)

  // Both are handed to effects that listen on the window, so a fresh object
  // every render would mean tearing those listeners down and putting them back
  // on every render.
  const content = useMemo(() => gridExtent(elements), [elements])
  const extent = useMemo(
    () =>
      resizingKey
        ? {
            columns: content.columns + RESIZE_HEADROOM,
            rows: content.rows + RESIZE_HEADROOM,
          }
        : content,
    [content, resizingKey],
  )
  const frame = useMemo(
    () => boardFrame({ ...extent, cellSize, padding }),
    [extent, cellSize, padding],
  )

  // Committing runs the same placement the preview ran, so what is kept is
  // exactly what was on screen when the element was let go. `baseSpan` is only
  // there after a resize, and only the element it belongs to carries one - a
  // footprint that came from the element's type stays with the type.
  const commit = useCallback(
    (settling) => {
      setResizingKey(null)
      const settled = normaliseCells(placeWithinGrid(elements, settling, extent))
      onLayoutChange(
        settled.map(({ key, cell, rotation }) =>
          key === settling.key && settling.baseSpan
            ? { key, cell, rotation, span: settling.baseSpan }
            : { key, cell, rotation },
        ),
      )
    },
    [elements, extent, onLayoutChange],
  )

  const editable = interactive && Boolean(onLayoutChange)
  const stopResize = useCallback(() => setResizingKey(null), [])

  const { drag, begin, takeClick } = useBoardDrag({
    elements,
    frame,
    // Moving stays inside the board as it is - the headroom is room to grow
    // into, not somewhere to put things.
    extent: content,
    onDrop: editable ? commit : null,
  })

  const { footprint: resize, grab } = useBoardResize({
    target: elements.find((item) => item.key === resizingKey) ?? null,
    frame,
    extent,
    boardRef,
    onCommit: commit,
    onCancel: stopResize,
  })

  // The two gestures ask different questions - where does it go, how large is
  // it - but they answer in the same shape, so everything downstream of here
  // only has to know that something is being edited.
  const editing = drag ?? resize

  // While an element is being edited the board shows where things would end up
  // if it were let go now, neighbours included. Worked out from the committed
  // layout every time rather than from the last preview, so going back to where
  // you started puts everything back where it was instead of leaving a trail.
  const shown = useMemo(() => {
    if (!editing) return elements
    return withPositions(placeWithinGrid(elements, editing, extent), CELL_PITCH, extent)
  }, [editing, elements, extent])

  useEffect(() => {
    if (!active) return undefined
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [active, close])

  // An open ring belongs to an element at a position, and editing moves them
  // all, so it cannot stay open across one.
  useEffect(() => {
    if (editing) setActive(null)
  }, [editing])

  // A drag replaces whatever was being resized: the element is being moved
  // instead, and two answers about the same element cannot both be pending.
  useEffect(() => {
    if (drag) stopResize()
  }, [drag, stopResize])

  const activeElement = elements.find((element) => element.key === active?.key)

  // The ring's own entries, plus resizing where the hardware actually varies in
  // size. Kept out of the caller's list so that every board that can be edited
  // offers it, without each one remembering to.
  const ringItems = useMemo(() => {
    if (!menu?.length) return menu
    return editable && activeElement?.resizable ? [...menu, RESIZE_ITEM] : menu
  }, [menu, editable, activeElement])

  return (
    <>
      <div
        ref={boardRef}
        className="device-board"
        data-interactive={interactive}
        data-dragging={Boolean(drag)}
        style={{
          inlineSize: `${Math.round(frame.width)}px`,
          blockSize: `${Math.round(frame.height)}px`,
        }}
      >
        {editing ? (
          <BoardGrid
            frame={frame}
            columns={extent.columns}
            rows={extent.rows}
            focus={editing}
            accent={accent ?? element.accent}
          />
        ) : null}

        <Canvas
          orthographic
          camera={viewCamera(frame.zoom)}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <ElementLights />
          <Suspense fallback={null}>
            <group position={SCENE_OFFSET}>
              {shown.map((item) => (
                <BoardSlot
                  key={item.key}
                  element={item}
                  accent={accent ?? element.accent}
                  housing={housing ?? element.housing}
                  interactive={interactive}
                  selectable={interactive && Boolean(menu?.length)}
                  carried={drag?.key === item.key}
                  onOpen={setActive}
                  onSelect={onSelect}
                  onPress={begin}
                  takeClick={takeClick}
                />
              ))}
            </group>
          </Suspense>
        </Canvas>

        {resize ? (
          <ResizeOverlay
            frame={frame}
            footprint={resize}
            accent={accent ?? element.accent}
            onGrab={grab}
          />
        ) : null}
      </div>

      {editing ? <DragHints hints={drag ? DRAG_HINTS : RESIZE_HINTS} /> : null}

      {active && ringItems?.length ? (
        <RadialMenu
          anchor={active.anchor}
          radius={active.radius}
          items={ringItems}
          label={`${activeElement?.label ?? 'Element'} actions`}
          onSelect={(id, item) => {
            if (id === RESIZE_ITEM.id) setResizingKey(activeElement.key)
            else onMenuSelect?.(id, item, activeElement)
          }}
          onClose={close}
        />
      ) : null}
    </>
  )
}

function BoardSlot({
  element,
  accent,
  housing,
  interactive,
  selectable,
  carried,
  onOpen,
  onSelect,
  onPress,
  takeClick,
}) {
  const groupRef = useRef(null)
  const playRef = useRef(null)
  const { camera, gl } = useThree()

  function handleClick(event) {
    // Only the frontmost element under the pointer reacts, otherwise the click
    // also hits whatever is behind it.
    event.stopPropagation()
    // The click that ends a drag is still a click as far as the browser is
    // concerned. Letting it through would play the press animation and open the
    // ring every time an element was put down.
    if (takeClick?.()) return
    playRef.current?.()
    // Selecting is separate from opening the ring: a click should already tell
    // the rest of the screen which element you mean, without going through a
    // menu first.
    onSelect?.(element)
    if (selectable) onOpen({ key: element.key, ...ringFor(groupRef.current, camera, gl) })
  }

  const handlers = interactive
    ? {
        onClick: handleClick,
        onPointerDown: (event) => {
          event.stopPropagation()
          onPress?.(element, event.nativeEvent ?? event)
        },
        onPointerOver: () => (gl.domElement.style.cursor = 'pointer'),
        onPointerOut: () => (gl.domElement.style.cursor = 'auto'),
      }
    : {}

  const [x, y, z] = element.position
  // A quarter turn on the board is a quarter turn about the upright axis. The
  // sign follows from the grid: a column runs along +x and a row along +z, so a
  // clockwise turn on screen is a negative rotation here.
  const rotation = [0, (-(element.rotation ?? 0) * Math.PI) / 180, 0]

  // An element covering more cells than its type says has been resized, and the
  // model has to follow - a display given twice the room is twice the panel,
  // not the same panel with empty board around it. Worked out from the upright
  // footprint, because the scale is applied in the same local space the
  // rotation above turns.
  const natural = elementType(element.typeId).span ?? [1, 1]
  const upright = spanFor(element.span, element.rotation)
  const scale = [upright[0] / natural[0], 1, upright[1] / natural[1]]

  return (
    <group
      ref={groupRef}
      position={[x, carried ? y + CARRY_LIFT : y, z]}
      rotation={rotation}
      scale={scale}
      {...handlers}
    >
      <ElementBoundary>
        <DeviceElement
          typeId={element.typeId}
          accent={accent}
          housing={housing}
          playRef={playRef}
        />
      </ElementBoundary>
    </group>
  )
}

const MIN_RING_RADIUS = 46
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

  // An ellipse around the element, not a circle around its longest side. A
  // circle has to clear the widest dimension in every direction, so on a fader
  // the entry directly above ends up a fader's width away for no reason. Each
  // axis gets its own reach, and every entry then sits the same short distance
  // from the shape whichever way it lies - which also means a rotated fader
  // needs no special case.
  return {
    anchor: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
    radius: {
      x: Math.max(MIN_RING_RADIUS, (maxX - minX) / 2 + RING_CLEARANCE),
      y: Math.max(MIN_RING_RADIUS, (maxY - minY) / 2 + RING_CLEARANCE),
    },
  }
}

export default DeviceBoard
