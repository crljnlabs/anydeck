import { useCallback, useEffect, useId, useRef } from 'react'
import AnydeckIconArt from './AnydeckIconArt.jsx'
import { ACCENT_SETS } from './style-sets.js'
import './anydeck-icon.css'

/* The animation is one continuous progress value p ∈ [0, 1] driven by hover,
 * focus or touch. It runs in two acts that hand over at SEAT:
 *
 *   p < SEAT   the keycap of the resting artwork descends onto the stem
 *   p > SEAT   the resting artwork is swapped for the projection sweep — 13
 *              genuine camera angles of the same object, stepped through in
 *              order, which is why it reads as a rotation rather than a fade
 *
 * The handover frame is drawn identically in both acts, so the swap is
 * invisible. Everything below writes SVG attributes directly instead of going
 * through state: at 60fps React reconciliation would be the only slow part.
 */
const SEAT = 0.34
const DURATION = 1000
const MAX_STEP = 48

// Phase 1 offsets, measured from the source artwork.
const SEAT_X = -34.8
const SEAT_Y = 165.2
const CONTACT_Y = 20.1
const PRESS_Y = 18.5
const PRESS_SCALE = 0.972

const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2

export function AnydeckIcon({
  size,
  surface = 'auto',
  accent = 'orange',
  interactive = true,
  label = 'AnyDeck',
  className = '',
  style,
  onClick,
  ...rest
}) {
  const uid = `adk${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const hostRef = useRef(null)
  const parts = useRef(null)
  const anim = useRef({ p: 0, target: 0, pressed: false, raf: 0, last: 0 })

  // Collected on first use rather than on mount: getBBox forces layout, and an
  // icon that is never hovered should never pay for it.
  const collect = useCallback(() => {
    if (parts.current || !hostRef.current) return parts.current
    const host = hostRef.current
    const frames = Array.from(host.querySelectorAll('[data-frame]'))
    parts.current = {
      frames,
      rest: host.querySelector('[data-rest]'),
      cap: host.querySelector('[data-cap]'),
      contact: host.querySelector('[data-contact]'),
      // Housing and stem are fixed hardware. Only the keycap's own faces are
      // grouped per frame, so a press moves the cap and nothing else.
      caps: frames.map((frame) => {
        const g = frame.querySelector('[data-cap-face]')
        const box = g.getBBox()
        return { g, cx: box.x + box.width / 2, cy: box.y + box.height / 2 }
      }),
      shownFrame: -1,
      shownDown: null,
    }
    return parts.current
  }, [])

  const paint = useCallback(() => {
    const p = collect()
    if (!p) return
    const { p: progress, pressed } = anim.current

    const seat = easeInOutQuad(Math.min(1, progress / SEAT))
    const rot = Math.max(0, (progress - SEAT) / (1 - SEAT))
    const sweeping = rot > 0

    // Act 1 — the resting artwork's cap settles onto the stem, and can be
    // pushed a little further while it is still the thing on screen.
    const push = pressed && !sweeping ? PRESS_Y : 0
    p.cap.setAttribute(
      'transform',
      `translate(${SEAT_X * seat} ${SEAT_Y * seat + push})`,
    )
    p.contact.setAttribute(
      'transform',
      `translate(${SEAT_X * seat} ${CONTACT_Y * seat})`,
    )

    // Act 2 — hand over to the sweep at the frame the two acts share exactly.
    const index = sweeping ? Math.round(rot * (p.frames.length - 1)) : -1
    if (index !== p.shownFrame) {
      if (p.shownFrame >= 0) p.frames[p.shownFrame].setAttribute('opacity', '0')
      if (index >= 0) p.frames[index].setAttribute('opacity', '1')
      p.rest.setAttribute('opacity', sweeping ? '0' : '1')
      p.shownFrame = index
    }

    const down = pressed && sweeping
    if (down !== p.shownDown) {
      for (const c of p.caps) {
        c.g.setAttribute(
          'transform',
          down
            ? `translate(${c.cx} ${c.cy}) scale(${PRESS_SCALE}) translate(${-c.cx} ${-c.cy})`
            : 'translate(0 0)',
        )
      }
      p.shownDown = down
    }
  }, [collect])

  const kick = useCallback(() => {
    const a = anim.current
    if (a.raf) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      // No sweep, but the key still seats — the state change stays legible.
      a.p = a.target > 0 ? SEAT : 0
      paint()
      return
    }
    a.last = performance.now()
    const step = (now) => {
      const dt = Math.min(MAX_STEP, now - a.last)
      a.last = now
      const dir = a.target > a.p ? 1 : -1
      a.p = Math.max(0, Math.min(1, a.p + (dir * dt) / DURATION))
      paint()
      a.raf = a.p === a.target ? 0 : requestAnimationFrame(step)
    }
    a.raf = requestAnimationFrame(step)
  }, [paint])

  const engage = useCallback(() => {
    anim.current.target = 1
    hostRef.current?.setAttribute('data-engaged', 'true')
    kick()
  }, [kick])

  const release = useCallback(() => {
    anim.current.target = 0
    anim.current.pressed = false
    hostRef.current?.setAttribute('data-engaged', 'false')
    kick()
  }, [kick])

  const setPressed = useCallback(
    (value) => {
      anim.current.pressed = value
      paint()
    },
    [paint],
  )

  // No paint on mount: the markup already ships in the resting pose, which is
  // what keeps the first frame free of a layout-forcing getBBox pass.
  useEffect(() => {
    const a = anim.current
    return () => {
      if (a.raf) cancelAnimationFrame(a.raf)
    }
  }, [])

  const named = ACCENT_SETS.includes(accent)
  const vars = {
    ...(size && { '--adk-size': typeof size === 'number' ? `${size}px` : size }),
    ...(named || !accent ? null : { '--adk-accent': accent }),
    ...style,
  }

  const Tag = interactive ? 'button' : 'div'
  const handlers = interactive
    ? {
        onPointerEnter: engage,
        onPointerLeave: release,
        onPointerDown: () => setPressed(true),
        onPointerUp: () => setPressed(false),
        onPointerCancel: release,
        onFocus: engage,
        onBlur: release,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') setPressed(true)
        },
        onKeyUp: (e) => {
          if (e.key === 'Enter' || e.key === ' ') setPressed(false)
        },
        onClick,
        type: 'button',
        'aria-label': label,
      }
    : { role: 'img', 'aria-label': label }

  return (
    <Tag
      ref={hostRef}
      className={`adk ${className}`.trim()}
      data-surface={surface}
      data-accent={named ? accent : undefined}
      data-interactive={String(interactive)}
      data-engaged="false"
      style={vars}
      {...handlers}
      {...rest}
    >
      <AnydeckIconArt uid={uid} />
    </Tag>
  )
}

export default AnydeckIcon
