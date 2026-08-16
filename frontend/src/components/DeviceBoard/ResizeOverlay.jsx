/**
 * The outline and the corner you drag while resizing an element.
 *
 * On top of the canvas, unlike the grid, because it has to be grabbed - and
 * because during a resize there is nothing else on the board to click. Only the
 * corner takes the pointer; the rest of the layer lets clicks through so that
 * pressing anywhere else ends the resize.
 *
 * The outline follows the footprint on the surface rather than the shape of the
 * model standing on it: cells are what is being changed here, and the model
 * follows from them.
 */
export function ResizeOverlay({ frame, footprint, accent, onGrab }) {
  const x = frame.left + footprint.cell[0] * frame.cellWidth
  const y = frame.top + footprint.cell[1] * frame.cellHeight
  const width = footprint.span[0] * frame.cellWidth
  const height = footprint.span[1] * frame.cellHeight

  return (
    <svg className="board-resize" width={frame.width} height={frame.height}>
      <rect
        className="board-resize-outline"
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={accent}
      />
      <g className="board-resize-handle" onPointerDown={onGrab}>
        {/* A generous transparent target around a small visible one: the
            drawn corner is as large as it should look, not as large as it
            has to be to hit. */}
        <circle cx={x + width} cy={y + height} r="14" fill="transparent" />
        <circle cx={x + width} cy={y + height} r="6" fill={accent} />
      </g>
    </svg>
  )
}

export default ResizeOverlay
