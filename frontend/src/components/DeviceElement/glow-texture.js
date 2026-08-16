import { CanvasTexture } from 'three'

/**
 * The soft halo drawn around a lit LED.
 *
 * A lens 5 mm across cannot look like a light source on its own, however bright
 * its material is - there is no area for the brightness to live in. Real
 * renderers solve this with a bloom pass over the whole image, which is an
 * extra render target per canvas and far more than this needs. A single
 * additive billboard with a soft falloff gives the same read for the cost of
 * one sprite.
 *
 * The falloff is deliberately not linear: a linear gradient reads as a flat
 * disc with a hard rim. Squaring it keeps the centre hot and lets the edge
 * disappear into the background.
 */
let texture = null

export function glowTexture() {
  if (texture) return texture

  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  )

  for (let step = 0; step <= 16; step++) {
    const t = step / 16
    gradient.addColorStop(t, `rgba(255,255,255,${(1 - t) ** 2.2})`)
  }

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  texture = new CanvasTexture(canvas)
  return texture
}
