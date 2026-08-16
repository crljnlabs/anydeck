import { useCallback, useEffect, useRef, useState } from 'react'
import { spanFor } from './element-layout'

/**
 * Making an element cover more or fewer cells.
 *
 * Reached from the ring rather than from a long press, because it is a
 * different question about the same element: a press asks where it goes, this
 * asks how large it is. Only elements whose real hardware varies in size are
 * offered it at all - a display or a strip genuinely comes in different sizes,
 * while a wider key is a different part and stretching its model would produce
 * a shape nobody sells.
 *
 * Everything below the gesture is the machinery moving already uses: the grid
 * appears, the footprint snaps to whole cells, and neighbours are pushed aside.
 * The corner the user drags is the far corner; the near one stays put, so the
 * element grows away from where it already sits instead of sliding around while
 * being resized.
 *
 * @param target  the element being resized, or null when nothing is
 * @param extent  the room available, which during a resize is the board plus
 *                headroom - see DeviceBoard for why growing needs somewhere to
 *                grow into
 */
export function useBoardResize({ target, frame, extent, boardRef, onCommit, onCancel }) {
  // The proposed footprint, in the same shape a drag produces, so the board can
  // preview either without caring which one is running.
  const [span, setSpan] = useState(null)
  const held = useRef(false)

  // A new target starts from whatever that element covers now.
  useEffect(() => {
    setSpan(target ? [...target.span] : null)
    held.current = false
  }, [target])

  const grab = useCallback((event) => {
    event.stopPropagation()
    held.current = true
  }, [])

  useEffect(() => {
    if (!target) return undefined

    const move = (event) => {
      if (!held.current) return
      const board = boardRef.current?.getBoundingClientRect()
      if (!board) return

      // What is being dragged is the far edge of the footprint, not a cell in
      // it, so the measurement is a distance that rounds to the nearest grid
      // line - which is the number of cells outright. Reading it as "the cell
      // under the pointer" instead would count the corner as being inside the
      // next cell along, and the footprint would grow by one the moment the
      // corner was touched.
      const columns =
        (event.clientX - board.left - frame.left) / frame.cellWidth - target.cell[0]
      const rows =
        (event.clientY - board.top - frame.top) / frame.cellHeight - target.cell[1]

      setSpan((current) => {
        const next = [
          clamp(Math.round(columns), 1, extent.columns - target.cell[0]),
          clamp(Math.round(rows), 1, extent.rows - target.cell[1]),
        ]
        return current && next[0] === current[0] && next[1] === current[1] ? current : next
      })
    }

    const up = () => {
      if (!held.current) return
      held.current = false
      onCommit({
        key: target.key,
        cell: target.cell,
        span,
        rotation: target.rotation,
        // Stored the way it is written down rather than the way it is currently
        // turned, so that turning it later swaps a footprint that was never
        // swapped to begin with.
        baseSpan: spanFor(span, target.rotation),
      })
    }

    // Anywhere else ends it without changing anything: the corner is the only
    // thing a resize listens to, so a press somewhere else is a press somewhere
    // else.
    const away = (event) => {
      if (held.current) return
      if (event.target.closest?.('.board-resize-handle')) return
      onCancel()
    }

    const key = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onCancel()
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('pointerdown', away)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('pointerdown', away)
      window.removeEventListener('keydown', key)
    }
  }, [target, span, frame, extent, boardRef, onCommit, onCancel])

  const footprint =
    target && span
      ? { key: target.key, cell: target.cell, span, rotation: target.rotation }
      : null

  return { footprint, grab }
}

function clamp(value, low, high) {
  return Math.min(Math.max(value, low), Math.max(low, high))
}

export default useBoardResize
