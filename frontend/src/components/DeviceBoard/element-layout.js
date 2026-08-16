import { elementType } from '../DeviceElement/element-types'

/**
 * Grid layout for a device.
 *
 * A device is a grid of cells, and every element occupies a whole number of
 * them. That is how the hardware actually works: keys sit on a 19 mm matrix, a
 * 2u key takes two positions, a display takes a block. Laying elements out as
 * "columns of equal width" only holds while every element is the same size,
 * which stops being true as soon as a display or a fader is on the board.
 *
 * The footprint of a type lives in `element-types.js` as `span: [cols, rows]`,
 * in cells of a quarter key each - see CELL_PITCH for why the cell is that
 * small.
 *
 * On resizing: an element can only be dragged larger where the real hardware
 * varies in size, which is why the registry carries a `resizable` flag. A
 * display or an LED strip genuinely comes in different sizes. A keycap does
 * not - a wider key is a different part, not a stretched one, and scaling its
 * model would produce a shape no manufacturer sells. For those, "make it wider"
 * means picking the 2u variant, not scaling.
 */

/**
 * A quarter of a key position.
 *
 * Not one cell per key: elements differ in size by far more than a factor of
 * two. An LED is about 5 mm and a key 19 mm, so on a key-sized grid the LED
 * would either claim a whole key position or have to be drawn too large. A
 * quarter-key cell is roughly LED-sized, which makes the LED the natural 1x1
 * and a key a 4x4 - every element then rounds to something close to its real
 * footprint instead of being forced up to the nearest key.
 */
export const CELL_PITCH = 0.019 / 4

/** Cells are square in metres, so a grid stays proportional to the hardware. */
export function cellSize(pitch = CELL_PITCH) {
  return pitch
}

/**
 * Flow a list of elements into a grid, left to right, wrapping on overflow.
 *
 * Accepts plain type ids for the simple case, or objects to pin an element to a
 * cell or override its footprint:
 *
 *     gridLayout(['keycap-standard-1u', { typeId: 'display-screen', span: [3, 2] }])
 */
export function gridLayout(
  entries,
  { columns = 16, pitch = CELL_PITCH, gap = 1 } = {},
) {
  const items = entries.map((entry) =>
    typeof entry === 'string' ? { typeId: entry } : entry,
  )

  // Shelf packing: elements are placed in the order they were given, left to
  // right, and a new row starts below everything already placed. Deliberately
  // no back-filling of gaps - an earlier version searched for the first free
  // cell, which wedged a 1x1 LED into whatever hole two large elements happened
  // to leave and produced a layout nobody asked for.
  let cursor = 0
  let shelfTop = 0
  let shelfHeight = 0
  let shelfStart = 0

  const placed = []

  const centreShelf = () => {
    // Small elements sit in the middle of their row rather than clinging to its
    // top edge, which is where an LED next to a key would otherwise end up.
    for (let i = shelfStart; i < placed.length; i++) {
      const item = placed[i]
      item.cell[1] += Math.floor((shelfHeight - item.span[1]) / 2)
    }
  }

  items.forEach((item, index) => {
    const type = elementType(item.typeId)
    const [width, height] = item.span ?? type.span ?? [1, 1]

    if (item.cell) {
      // Pinned by the caller: taken as given, and it does not move the cursor.
      placed.push(entry(item, index, type, [width, height], [...item.cell]))
      return
    }

    if (cursor + width > columns && cursor > 0) {
      centreShelf()
      shelfTop += shelfHeight + gap
      cursor = 0
      shelfHeight = 0
      shelfStart = placed.length
    }

    placed.push(entry(item, index, type, [width, height], [cursor, shelfTop]))
    // A footprint is the element itself, so without a gap neighbours touch.
    // A key already carries its 1 mm of key-matrix clearance inside its four
    // cells, but a 1x1 LED carries none and ends up glued to whatever is next
    // to it.
    cursor += width + gap
    shelfHeight = Math.max(shelfHeight, height)
  })

  centreShelf()

  return withPositions(placed, pitch)
}

function entry(item, index, type, span, cell) {
  return {
    key: item.key ?? `${item.typeId}-${index}`,
    typeId: item.typeId,
    label: item.label ?? type.label,
    cell,
    span,
    resizable: item.resizable ?? type.resizable ?? false,
  }
}

/**
 * Turn cell coordinates into metres, centred on the origin.
 *
 * The board's camera looks at the origin, so centring here means a device of
 * any size is framed without the caller working out an offset. An element wider
 * than one cell is centred across the cells it covers, not pinned to the first.
 */
export function withPositions(placed, pitch = CELL_PITCH) {
  const columns = Math.max(...placed.map((item) => item.cell[0] + item.span[0]), 1)
  const rows = Math.max(...placed.map((item) => item.cell[1] + item.span[1]), 1)

  const elements = placed.map((item) => {
    const [col, row] = item.cell
    const [width, height] = item.span
    return {
      ...item,
      position: [
        (col + width / 2 - columns / 2) * pitch,
        0,
        (row + height / 2 - rows / 2) * pitch,
      ],
    }
  })

  // The grid extent travels with the elements: the board needs it to size
  // itself to its contents instead of stretching across whatever is available.
  elements.columns = columns
  elements.rows = rows

  return elements
}

export function gridExtent(elements) {
  const columns =
    elements.columns ?? Math.max(...elements.map((e) => e.cell[0] + e.span[0]), 1)
  const rows = elements.rows ?? Math.max(...elements.map((e) => e.cell[1] + e.span[1]), 1)
  return { columns, rows }
}
