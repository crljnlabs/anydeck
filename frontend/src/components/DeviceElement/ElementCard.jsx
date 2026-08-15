import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { RadialMenu } from '../RadialMenu'
import { DeviceElement } from './DeviceElement'
import { DEFAULT_ACCENT, elementType } from './element-types'
import './device-element.css'

// The models are in metres, so a 1u key is 0.018 across. The default near
// plane of 0.1 would clip the whole scene away - hence the tiny near/far.
//
// The elevation is deliberately low. On a key or a knob the moving part is
// wider than the housing it sits on - a real keycap overhangs its switch - so
// a steeper angle hides the housing completely behind the cap.
const CAMERA = { position: [0.038, 0.032, 0.054], fov: 35, near: 0.001, far: 2 }

// Elements stand on y = 0 and are at most ~18 mm tall, so lifting the scene by
// half that centres it on the camera's default target.
const SCENE_OFFSET = [0, -0.008, 0]

/**
 * An element on its own small canvas, in a DOM box that can be clicked.
 *
 * Two behaviours, and a caller picks either or both:
 *
 *   animateOnClick   the element plays its motion - a key presses, a knob turns
 *   menu             a radial menu opens around the element
 *
 * They are intentionally not separate components. A click has to be able to do
 * both at once (the animation is the feedback that the click landed), and
 * splitting them would mean two components racing for the same click.
 *
 * One canvas per card is fine for a palette of a dozen elements, but browsers
 * cap the number of live WebGL contexts. A device editor showing many elements
 * at once should put them all in one shared canvas instead and use
 * `DeviceElement` directly - it is written to not care which canvas it is in.
 */
export function ElementCard({
  typeId,
  accent = DEFAULT_ACCENT,
  label,
  menu = null,
  onMenuSelect,
  animateOnClick = true,
  className = '',
  ...rest
}) {
  const type = elementType(typeId)
  const boxRef = useRef(null)
  const playRef = useRef(null)
  const [anchor, setAnchor] = useState(null)

  const anchorFromBox = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect()
    if (!box) return null
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
  }, [])

  function handleClick() {
    if (animateOnClick) playRef.current?.()
    if (menu?.length) setAnchor(anchorFromBox())
  }

  // The ring is positioned in viewport coordinates, so it has to follow the
  // element when the page moves underneath it.
  useEffect(() => {
    if (!anchor) return undefined
    const follow = () => setAnchor(anchorFromBox())
    window.addEventListener('resize', follow)
    window.addEventListener('scroll', follow, true)
    return () => {
      window.removeEventListener('resize', follow)
      window.removeEventListener('scroll', follow, true)
    }
  }, [anchor, anchorFromBox])

  return (
    <>
      <button
        ref={boxRef}
        type="button"
        className={`element-card ${className}`.trim()}
        data-open={anchor ? 'true' : 'false'}
        aria-label={label ?? type.label}
        aria-haspopup={menu?.length ? 'menu' : undefined}
        aria-expanded={menu?.length ? Boolean(anchor) : undefined}
        onClick={handleClick}
        {...rest}
      >
        <span className="element-card-stage">
          <Canvas camera={CAMERA} dpr={[1, 2]} gl={{ antialias: true }}>
            <ambientLight intensity={1.1} />
            <directionalLight position={[0.05, 0.09, 0.06]} intensity={2.6} />
            {/* The housing is nearly black (#2a2b30 in the models). Without a
                rim from behind it merges into a dark page background and the
                element looks like a floating cap with nothing underneath. */}
            <directionalLight position={[-0.06, 0.02, -0.07]} intensity={2.2} />
            <directionalLight position={[0.02, -0.04, 0.05]} intensity={0.5} />
            <Suspense fallback={null}>
              <group position={SCENE_OFFSET}>
                <DeviceElement typeId={type.id} accent={accent} playRef={playRef} />
              </group>
            </Suspense>
          </Canvas>
        </span>

        <span className="element-card-label">{label ?? type.label}</span>
      </button>

      {anchor && menu?.length ? (
        <RadialMenu
          anchor={anchor}
          items={menu}
          label={`${label ?? type.label} actions`}
          onSelect={(id, item) => onMenuSelect?.(id, item, type)}
          onClose={() => setAnchor(null)}
        />
      ) : null}
    </>
  )
}

export default ElementCard
