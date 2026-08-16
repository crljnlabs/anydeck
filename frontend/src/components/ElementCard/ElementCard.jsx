import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  PALETTE_SCALE,
  screenHeight,
  viewCamera,
} from '../DeviceElement/element-view'
import { useSettings } from '../../contexts/settings'
import { RadialMenu } from '../RadialMenu'
import { DeviceElement } from '../DeviceElement'
import { ElementLights } from '../DeviceElement/ElementLights'
import { elementType } from '../DeviceElement/element-types'
import './element-card.scss'

// Room around the element inside its card, and the smallest a card may get so
// a 10 mm LED still has something to click and a label to sit under.
const CARD_PADDING = 26
const MIN_CARD_WIDTH = 88

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

  // One scale for the whole palette. The card grows with its element rather
  // than the element shrinking into a fixed card - which is what made a 6.25u
  // key's housing invisible while a 1u key's was plain to see.
  const size = type.size ?? [0.018, 0.0185, 0.018]
  const stageWidth = Math.max(
    MIN_CARD_WIDTH,
    Math.round(size[0] * PALETTE_SCALE) + CARD_PADDING * 2,
  )
  const stageHeight = Math.round(screenHeight(size) * PALETTE_SCALE) + CARD_PADDING * 2
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
        <span
          className="element-card-stage"
          style={{ inlineSize: `${stageWidth}px`, blockSize: `${stageHeight}px` }}
        >
          <Canvas
            orthographic
            camera={viewCamera(PALETTE_SCALE)}
            dpr={[1, 2]}
            gl={{ antialias: true }}
          >
            <ElementLights />
            <Suspense fallback={null}>
              {/* Every model is centred on x and z and stands on y = 0, so
                  half its height is all it takes to centre it. */}
              <group position={[0, -size[1] / 2, 0]}>
                <DeviceElement
                  typeId={type.id}
                  accent={accent ?? element.accent}
                  housing={housing ?? element.housing}
                  playRef={playRef}
                />
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
