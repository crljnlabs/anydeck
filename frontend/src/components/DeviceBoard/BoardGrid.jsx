import { useId } from 'react'
import { cellCentre } from './board-frame'

/**
 * The grid, shown while an element is being moved.
 *
 * Drawn as flat lines behind the canvas rather than as geometry inside it. The
 * canvas is transparent, so the elements standing on the surface cover the
 * lines that pass behind them - the occlusion comes out right without the grid
 * having to take part in the 3D scene at all.
 *
 * It is not evenly lit. Lighting the whole board equally turns a device into
 * graph paper and puts the emphasis everywhere, when the only cells that matter
 * are the ones the element is being dropped into. So there is a faint grid
 * across the board for orientation, and a much brighter one that fades out with
 * distance from the element in hand.
 *
 * @param frame   from boardFrame(): where the lattice sits in pixels
 * @param focus   { cell, span } of the element being moved
 */
export function BoardGrid({ frame, columns, rows, focus, accent }) {
  const id = useId()
  const maskId = `${id}-near`

  const centre = cellCentre(focus.cell, focus.span, frame)
  // Far enough to take in the neighbours an element can displace, close enough
  // that the far side of a wide board stays quiet.
  const reach = Math.max(frame.cellWidth, frame.cellHeight) * 9

  const lines = []
  for (let column = 0; column <= columns; column++) {
    const x = frame.left + column * frame.cellWidth
    lines.push(<line key={`v${column}`} x1={x} y1={frame.top} x2={x} y2={frame.top + rows * frame.cellHeight} />)
  }
  for (let row = 0; row <= rows; row++) {
    const y = frame.top + row * frame.cellHeight
    lines.push(<line key={`h${row}`} x1={frame.left} y1={y} x2={frame.left + columns * frame.cellWidth} y2={y} />)
  }

  return (
    <svg className="board-grid" width={frame.width} height={frame.height} aria-hidden="true">
      <defs>
        <radialGradient id={maskId} gradientUnits="userSpaceOnUse" cx={centre.x} cy={centre.y} r={reach}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${maskId}-mask`}>
          <rect width={frame.width} height={frame.height} fill={`url(#${maskId})`} />
        </mask>
      </defs>

      <g className="board-grid-far">{lines}</g>
      <g className="board-grid-near" mask={`url(#${maskId}-mask)`}>{lines}</g>

      {/* Where the element will land. Drawn last so it reads as the answer to
          the question the grid is asking. */}
      <rect
        className="board-grid-target"
        x={frame.left + focus.cell[0] * frame.cellWidth}
        y={frame.top + focus.cell[1] * frame.cellHeight}
        width={focus.span[0] * frame.cellWidth}
        height={focus.span[1] * frame.cellHeight}
        fill={accent}
        stroke={accent}
      />
    </svg>
  )
}

export default BoardGrid
