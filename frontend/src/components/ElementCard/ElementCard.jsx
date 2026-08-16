import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { viewCamera } from '../DeviceElement/element-view'
import { FitCamera } from './FitCamera'
import { useSettings } from '../../contexts/settings'
import { RadialMenu } from '../RadialMenu'
import { DeviceElement } from '../DeviceElement'
import { ElementLights } from '../DeviceElement/ElementLights'
import { elementType } from '../DeviceElement/element-types'
import './element-card.scss'

// Each card fits its own element rather than sharing one scale across the
// palette. A palette spans an LED at 10 mm and a 6.25u key at 119 mm; at a
// shared scale one of the two is always unusable. Relative size is what the
// board is for - this is a list of what exists.

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
  accent,
  housing,
  label,
  menu = null,
  onMenuSelect,
  animateOnClick = true,
  className = '',
  ...rest
}) {
  const type = elementType(typeId)
  // Colours come from the app theme unless a caller overrides them, so no page
  // has to thread them through by hand.
  const { element } = useSettings()
  const boxRef = useRef(null)
  const sceneRef = useRef(null)
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
          <Canvas
            orthographic
            camera={viewCamera(1)}
            dpr={[1, 2]}
            gl={{ antialias: true }}
          >
            <ElementLights />
            <Suspense fallback={null}>
              <group ref={sceneRef}>
                <DeviceElement
                  typeId={type.id}
                  accent={accent ?? element.accent}
                  housing={housing ?? element.housing}
                  playRef={playRef}
                />
              </group>
              {/* Inside the boundary, so it runs once the model is there. */}
              <FitCamera target={sceneRef} />
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
