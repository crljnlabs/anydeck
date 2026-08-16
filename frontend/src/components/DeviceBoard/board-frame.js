import { CELL_PITCH } from './element-layout'
import { ELEMENT_HEIGHT, ELEVATION } from '../DeviceElement/element-view'

/**
 * Where the grid lands on screen.
 *
 * The camera is orthographic and looks down the board at a fixed elevation with
 * no sideways offset, which makes the projection of the surface a plain
 * rectangular lattice: a cell is always `cellSize` pixels across and
 * `cellSize * sin(elevation)` pixels down, wherever it sits. That is what lets
 * the grid be drawn as flat lines behind the canvas and the pointer be turned
 * into a cell by dividing, with no ray to cast and no rounding to argue about.
 *
 * The vertical offset is the room the board keeps above the surface for the
 * elements standing on it - without it the tallest element would be cut off at
 * the top edge.
 */
export function boardFrame({ columns, rows, cellSize, padding }) {
  const zoom = cellSize / CELL_PITCH
  const cellHeight = cellSize * Math.sin(ELEVATION)
  const headroom = ELEMENT_HEIGHT * zoom * Math.cos(ELEVATION)

  return {
    zoom,
    cellWidth: cellSize,
    cellHeight,
    left: padding,
    top: padding + headroom,
    width: columns * cellSize + padding * 2,
    height: rows * cellHeight + headroom + padding * 2,
  }
}

/** Pointer movement in pixels, as a whole number of cells. */
export function cellsMoved(dx, dy, frame) {
  return [Math.round(dx / frame.cellWidth), Math.round(dy / frame.cellHeight)]
}

/** The middle of a footprint, in pixels relative to the board. */
export function cellCentre(cell, span, frame) {
  return {
    x: frame.left + (cell[0] + span[0] / 2) * frame.cellWidth,
    y: frame.top + (cell[1] + span[1] / 2) * frame.cellHeight,
  }
}
