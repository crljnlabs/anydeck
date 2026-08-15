import { elementType } from './element-types'

/** Key spacing on real hardware: 19 mm pitch is standard, 21 mm gives air. */
const DEFAULT_PITCH = 0.021

/**
 * Lay type ids out on a grid, for callers that want a row or block of elements
 * without picking coordinates by hand.
 *
 * Positions are in metres, the same scale the models use, so the result is a
 * device at its real physical spacing rather than an arbitrary arrangement.
 * The grid is centred on the origin, which is where the board's camera looks.
 */
export function gridLayout(typeIds, { columns = 4, pitch = DEFAULT_PITCH } = {}) {
  const rows = Math.ceil(typeIds.length / columns)

  return typeIds.map((typeId, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    return {
      key: `${typeId}-${index}`,
      typeId,
      label: elementType(typeId).label,
      position: [
        (column - (columns - 1) / 2) * pitch,
        0,
        (row - (rows - 1) / 2) * pitch,
      ],
    }
  })
}
