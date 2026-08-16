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
 * The footprint an element claims once it has been turned.
 *
 * Rotation goes in quarter turns only, because the grid is square: a fader at
 * 45 degrees would cover parts of cells and there would be no honest answer to
 * which ones it occupies. At a quarter turn the footprint simply swaps - a 10x2
 * fader standing upright is 2x10 - and everything downstream keeps working in
 * whole cells.
 */
export function spanFor(span, rotation = 0) {
  return normaliseRotation(rotation) % 180 ? [span[1], span[0]] : [span[0], span[1]]
}

export function normaliseRotation(rotation) {
  return ((Math.round((rotation ?? 0) / 90) * 90) % 360 + 360) % 360
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

  const placed = []
  // Only the elements this pass laid out itself. An element pinned to a cell is
  // not on a shelf and must never be centred into one: doing that moved every
  // pinned element up by half its own height, which drifted a little further
  // every time a layout was fed back in after being edited.
  let shelf = []

  const centreShelf = () => {
    // Small elements sit in the middle of their row rather than clinging to its
    // top edge, which is where an LED next to a key would otherwise end up.
    shelf.forEach((item) => {
      item.cell[1] += Math.floor((shelfHeight - item.span[1]) / 2)
    })
    shelf = []
  }

  items.forEach((item, index) => {
    const type = elementType(item.typeId)
    const [width, height] = spanFor(item.span ?? type.span ?? [1, 1], item.rotation)

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
    }

    const laid = entry(item, index, type, [width, height], [cursor, shelfTop])
    placed.push(laid)
    shelf.push(laid)
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
    rotation: normaliseRotation(item.rotation),
    resizable: item.resizable ?? type.resizable ?? false,
  }
}

// --- moving an element around ------------------------------------------------

/**
 * Put one element where the user is holding it, and push whatever is in the way
 * out of its path.
 *
 * Pushing rather than refusing the drop is the deciding choice here. Refusing
 * would make some arrangements impossible to reach: a full board has no free
 * space to move through, so every rearrangement would first require moving
 * something else somewhere else, and the something else has the same problem.
 * Pushing means any layout can be reached by dragging elements at the layout
 * you want, which is the whole point.
 *
 * Each element in the way leaves by the shortest of the four ways out - past
 * the left, right, top or bottom edge of whatever it collides with. Ways out
 * that stay on the board win over shorter ones that leave it. An element that
 * has been pushed can push the next one in turn, so a row of keys shuffles
 * along rather than piling up on the first obstacle.
 *
 * @param placed  every element, the moving one included, with cell and span
 * @param moving  { key, cell, span } - taken as given, never pushed
 * @param extent  { columns, rows } of the board, used to prefer staying on it
 */
export function placeWithinGrid(placed, moving, extent) {
  const held = {
    ...placed.find((item) => item.key === moving.key),
    cell: [...moving.cell],
    span: [...moving.span],
    rotation: moving.rotation,
  }

  const settled = [held]
  const pending = placed
    .filter((item) => item.key !== moving.key)
    // Nearest first: the elements the moving one actually landed on get their
    // say before the ones further out, so a push travels outwards.
    .map((item) => ({ ...item, cell: [...item.cell] }))
    .sort((a, b) => distance(a, held) - distance(b, held))

  while (pending.length) {
    const item = pending.shift()
    // A push can put an element on top of something that has already settled,
    // so it keeps leaving until it is clear of all of them. The bound is a
    // safety net, not an expected case - every step moves strictly away.
    for (let step = 0; step < 32; step++) {
      const hit = settled.find((other) => overlaps(item, other))
      if (!hit) break
      item.cell = wayOut(item, hit, extent)
    }
    settled.push(item)
  }

  return settled
}

function distance(a, b) {
  return Math.hypot(
    a.cell[0] + a.span[0] / 2 - (b.cell[0] + b.span[0] / 2),
    a.cell[1] + a.span[1] / 2 - (b.cell[1] + b.span[1] / 2),
  )
}

export function overlaps(a, b) {
  return (
    a.cell[0] < b.cell[0] + b.span[0] &&
    b.cell[0] < a.cell[0] + a.span[0] &&
    a.cell[1] < b.cell[1] + b.span[1] &&
    b.cell[1] < a.cell[1] + a.span[1]
  )
}

function wayOut(item, hit, extent) {
  const [col, row] = item.cell
  const candidates = [
    [hit.cell[0] - item.span[0], row],
    [hit.cell[0] + hit.span[0], row],
    [col, hit.cell[1] - item.span[1]],
    [col, hit.cell[1] + hit.span[1]],
  ]

  const cost = (cell) => Math.abs(cell[0] - col) + Math.abs(cell[1] - row)
  const onBoard = (cell) =>
    cell[0] >= 0 &&
    cell[1] >= 0 &&
    (!extent || (cell[0] + item.span[0] <= extent.columns && cell[1] + item.span[1] <= extent.rows))

  const inside = candidates.filter(onBoard)
  return (inside.length ? inside : candidates).sort((a, b) => cost(a) - cost(b))[0]
}

/**
 * Pull a layout back to the top left corner.
 *
 * Pushing may leave an element at a negative cell, which is a position off the
 * board rather than a position on it. Run once a move is finished, never during
 * one - shifting everything while the user is still holding an element would
 * move the board out from under the pointer.
 */
export function normaliseCells(placed) {
  const left = Math.min(...placed.map((item) => item.cell[0]), 0)
  const top = Math.min(...placed.map((item) => item.cell[1]), 0)
  if (!left && !top) return placed
  return placed.map((item) => ({ ...item, cell: [item.cell[0] - left, item.cell[1] - top] }))
}

/**
 * Turn cell coordinates into metres, centred on the origin.
 *
 * The board's camera looks at the origin, so centring here means a device of
 * any size is framed without the caller working out an offset. An element wider
 * than one cell is centred across the cells it covers, not pinned to the first.
 *
 * `extent` overrides what the contents say, and exists for one reason: while an
 * element is being dragged the board must not re-centre. Working it out from
 * the contents would slide every element sideways the moment the layout grows
 * by a cell, which moves the board out from under the pointer mid-drag.
 */
export function withPositions(placed, pitch = CELL_PITCH, extent = null) {
  const columns =
    extent?.columns ?? Math.max(...placed.map((item) => item.cell[0] + item.span[0]), 1)
  const rows = extent?.rows ?? Math.max(...placed.map((item) => item.cell[1] + item.span[1]), 1)

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
