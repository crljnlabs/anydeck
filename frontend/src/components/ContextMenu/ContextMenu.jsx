import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './context-menu.scss'

/**
 * A plain list menu at the pointer - the right-click counterpart to RadialMenu.
 *
 * Two menus rather than one because they answer different questions. The ring
 * is for a handful of actions on a thing you can see and point at, and it needs
 * to not cover that thing. A list is for a longer, growing set of commands where
 * reading the labels matters more than where they sit.
 *
 * Same portal, same reason: a menu belonging to a card must not be clipped by
 * the card.
 */
export function ContextMenu({ at, items, onSelect, onClose }) {
  const ref = useRef(null)
  const [position, setPosition] = useState(at)

  // Nudged back inside the window if it would hang off an edge - a menu opened
  // near the bottom right otherwise runs off the screen.
  useLayoutEffect(() => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    setPosition({
      x: Math.min(at.x, window.innerWidth - box.width - 8),
      y: Math.min(at.y, window.innerHeight - box.height - 8),
    })
  }, [at])

  useEffect(() => {
    const close = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      onClose?.()
    }
    window.addEventListener('keydown', close)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [onClose])

  return createPortal(
    <div className="context-menu-layer">
      <div className="context-menu-backdrop" onPointerDown={onClose} onContextMenu={(e) => { e.preventDefault(); onClose?.() }} />
      <div
        ref={ref}
        className="context-menu"
        role="menu"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        {items.map((item) =>
          item.separator ? (
            <hr key={item.id} />
          ) : (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              data-tone={item.tone ?? 'default'}
              disabled={item.disabled}
              onClick={() => {
                onSelect?.(item.id, item)
                onClose?.()
              }}
            >
              <span>{item.label}</span>
              {item.hint ? <small>{item.hint}</small> : null}
            </button>
          ),
        )}
      </div>
    </div>,
    document.body,
  )
}

export default ContextMenu
