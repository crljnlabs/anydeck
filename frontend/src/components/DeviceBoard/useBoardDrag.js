import { useCallback, useEffect, useRef, useState } from 'react'
import { cellsMoved } from './board-frame'
import { normaliseRotation, spanFor } from './element-layout'

/** How long an element has to be held before it comes loose. */
const HOLD_TIME = 320

/**
 * Movement allowed during the hold before it counts as something else.
 *
 * A press is never perfectly still - a hand resting on a mouse drifts by a
 * pixel or two. Cancelling on any movement at all would make the long press
 * feel broken; this is loose enough to survive a steady hand and tight enough
 * that an actual drag of the page does not arm it.
 */
const HOLD_SLOP = 6

/**
 * How long after a drop a click still counts as part of the drop.
 *
 * The browser sends the click that follows a release immediately; anything
 * later than this is a new gesture and has to work.
 */
const CLICK_GRACE = 250

/**
 * Picking an element up, moving it over the grid, and putting it down.
 *
 * A long press starts it, so that a short click keeps meaning what it has
 * always meant: select the element and open its ring. The two gestures start
 * identically, which is why the press has to commit to one of them - after
 * HOLD_TIME the element comes loose, and the click that would otherwise follow
 * is swallowed.
 *
 * The pointer is turned into cells by plain division, because the board's
 * projection is a regular lattice (see board-frame.js). Everything is expressed
 * as a movement from where the element started rather than as an absolute
 * position, so the element does not jump to sit under the pointer when it is
 * picked up by its edge.
 */
export function useBoardDrag({ elements, frame, extent, onDrop }) {
  const [drag, setDrag] = useState(null)
  const state = useRef(null)
  // When the last drag ended. The click that ends a drag is swallowed, and it
  // arrives within a few milliseconds of the release - so this is a moment to
  // compare against rather than a flag to clear. A flag would stay set when a
  // drag ends somewhere no click follows, and swallow an honest click later.
  const droppedAt = useRef(0)

  const enabled = Boolean(onDrop)

  const finish = useCallback(() => {
    const current = state.current
    state.current = null
    clearTimeout(current?.timer)
    setDrag(null)
    return current
  }, [])

  const begin = useCallback(
    (element, event) => {
      if (!enabled) return
      const origin = { x: event.clientX, y: event.clientY }
      state.current = {
        key: element.key,
        origin,
        cell: [...element.cell],
        span: [...element.span],
        rotation: normaliseRotation(element.rotation),
        // The footprint before any turning. A placed element carries the span
        // it currently occupies, which for a quarter turn is already swapped -
        // turning that again would swap the swap.
        base: spanFor(element.span, element.rotation),
        started: false,
        timer: setTimeout(() => {
          if (!state.current) return
          state.current.started = true
          setDrag({
            key: state.current.key,
            cell: state.current.cell,
            span: state.current.span,
            rotation: state.current.rotation,
          })
        }, HOLD_TIME),
      }
    },
    [enabled],
  )

  useEffect(() => {
    if (!enabled) return undefined

    const clampToBoard = (cell, span) => [
      Math.min(Math.max(cell[0], 0), Math.max(extent.columns - span[0], 0)),
      Math.min(Math.max(cell[1], 0), Math.max(extent.rows - span[1], 0)),
    ]

    const move = (event) => {
      const current = state.current
      if (!current) return

      if (!current.started) {
        const drift = Math.hypot(event.clientX - current.origin.x, event.clientY - current.origin.y)
        if (drift > HOLD_SLOP) finish()
        return
      }

      const element = elements.find((item) => item.key === current.key)
      const [dColumn, dRow] = cellsMoved(
        event.clientX - current.origin.x,
        event.clientY - current.origin.y,
        frame,
      )
      const span = spanFor(current.base, current.rotation)
      const cell = clampToBoard(
        [element.cell[0] + dColumn, element.cell[1] + dRow],
        span,
      )

      current.cell = cell
      current.span = span
      setDrag({ key: current.key, cell, span, rotation: current.rotation })
    }

    const up = () => {
      const current = state.current
      if (!current) return
      if (!current.started) {
        finish()
        return
      }
      droppedAt.current = performance.now()
      finish()
      onDrop({
        key: current.key,
        cell: current.cell,
        span: current.span,
        rotation: current.rotation,
      })
    }

    const key = (event) => {
      const current = state.current
      if (!current?.started) return

      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
        return
      }

      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        const rotation = normaliseRotation(current.rotation + 90)
        const span = spanFor(current.base, rotation)
        current.rotation = rotation
        current.span = span
        current.cell = clampToBoard(current.cell, span)
        setDrag({ key: current.key, cell: current.cell, span, rotation })
      }
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('keydown', key)
    }
  }, [elements, frame, extent, onDrop, enabled, finish])

  // Give up the drag if the board itself goes away underneath it.
  useEffect(() => () => clearTimeout(state.current?.timer), [])

  const takeClick = useCallback(() => performance.now() - droppedAt.current < CLICK_GRACE, [])

  return { drag, begin, takeClick }
}

export default useBoardDrag
