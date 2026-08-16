import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './radial-menu.css'

const ITEM_RADIUS = 22   // half an item button, keep in sync with the stylesheet
const EDGE_PADDING = 10

/**
 * A ring of icon buttons drawn around a point on screen.
 *
 * Rendered through a portal into `document.body` with fixed positioning. That
 * is the whole reason it exists as its own component: elements of a device sit
 * close together, so the ring has to be able to paint over its neighbours. A
 * menu rendered inside the element's own box would be trapped by that box -
 * clipped by `overflow`, or stacked below a neighbour that happens to come
 * later in the DOM. Out here, neither can happen.
 *
 * @param anchor    {x, y} in viewport coordinates - the centre of the ring
 * @param items     [{ id, label, icon, tone }] - any length, laid out evenly
 * @param onSelect  called with the item id
 * @param onClose   called on Escape, on an outside click, and after a select
 */
export function RadialMenu({
  anchor,
  items,
  // A number for a circle, or {x, y} to hug an element that is much wider than
  // it is tall - see DeviceBoard for why that matters.
  radius = 62,
  label = 'Element actions',
  onSelect,
  onClose,
}) {
  const ringRef = useRef(null)
  // Memoised so the effect below depends on a stable object rather than on a
  // fresh one every render.
  const reach = useMemo(
    () => (typeof radius === 'number' ? { x: radius, y: radius } : radius),
    [radius],
  )
  const [angles, setAngles] = useState(() => fullCircle(items.length))

  // Placement depends on the viewport, so it can only be decided on the
  // client, after the anchor is known.
  useLayoutEffect(() => {
    setAngles(layout(anchor, items.length, reach))
  }, [anchor, items.length, reach])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Move focus into the ring so it can be driven from the keyboard, and so
  // closing it returns focus somewhere sensible.
  useEffect(() => {
    ringRef.current?.querySelector('button')?.focus()
  }, [])

  function choose(item) {
    onSelect?.(item.id, item)
    onClose?.()
  }

  return createPortal(
    <div className="radial-menu-layer">
      {/* Catches the click that dismisses the menu. Transparent, but it has to
          be a real element so a click on a neighbouring element closes the
          menu instead of immediately opening that neighbour's own. */}
      <div className="radial-menu-backdrop" onPointerDown={onClose} />

      <div
        ref={ringRef}
        className="radial-menu"
        role="menu"
        aria-label={label}
        style={{ left: `${anchor.x}px`, top: `${anchor.y}px` }}
      >
        {items.map((item, index) => {
          const angle = angles[index] ?? 0
          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="radial-menu-item"
              data-tone={item.tone ?? 'default'}
              title={item.label}
              aria-label={item.label}
              style={{
                '--x': `${Math.cos(angle) * reach.x}px`,
                '--y': `${Math.sin(angle) * reach.y}px`,
                '--delay': `${index * 22}ms`,
              }}
              onClick={() => choose(item)}
            >
              {item.icon}
              <span className="radial-menu-label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>,
    document.body,
  )
}

function fullCircle(count) {
  const step = (Math.PI * 2) / Math.max(count, 1)
  // Start at the top and go clockwise; screen y grows downwards.
  return Array.from({ length: count }, (_, index) => -Math.PI / 2 + index * step)
}

/**
 * Ring when there is room, arc when there is not.
 *
 * Near a window edge a full circle would push items off screen, so the items
 * are folded into a half circle opening back towards the middle of the
 * viewport - the direction that is guaranteed to have space.
 */
function layout(anchor, count, reach) {
  const spreadX = reach.x + ITEM_RADIUS + EDGE_PADDING
  const spreadY = reach.y + ITEM_RADIUS + EDGE_PADDING
  const fits =
    anchor.x - spreadX > 0 &&
    anchor.y - spreadY > 0 &&
    anchor.x + spreadX < window.innerWidth &&
    anchor.y + spreadY < window.innerHeight

  if (fits) return fullCircle(count)

  const towardsCentre = Math.atan2(
    window.innerHeight / 2 - anchor.y,
    window.innerWidth / 2 - anchor.x,
  )
  const span = Math.PI
  const step = count > 1 ? span / (count - 1) : 0
  return Array.from(
    { length: count },
    (_, index) => towardsCentre - span / 2 + index * step,
  )
}

export default RadialMenu
