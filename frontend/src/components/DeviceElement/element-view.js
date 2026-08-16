/**
 * The one viewpoint every element is drawn from.
 *
 * Shared between the palette and the board, because they were showing the same
 * object two different ways: a perspective camera at a shallow angle in the
 * list, an orthographic one from above on the device. Same lights, but a
 * different camera means different faces catch them, so a key in the list did
 * not look like the same key on the device.
 *
 * Orthographic everywhere. A device layout is a technical drawing rather than a
 * photograph: an element in the corner is drawn exactly like one in the middle,
 * a grid cell is always the same number of pixels, and the projection used to
 * place the action ring is exact.
 */

export const ELEVATION = (55 * Math.PI) / 180

/**
 * Camera position on a unit sphere at the shared elevation.
 *
 * Dead centre, with no sideways offset. A lateral offset rotates the whole
 * board on screen: a grid of elements is meant to sit square to the frame, and
 * anything else reads as a crooked photograph of it rather than a layout.
 */
export const VIEW_DIRECTION = [0, Math.sin(ELEVATION), Math.cos(ELEVATION)]

/** Tallest element in the set, roughly - a knob at 21 mm. */
export const ELEMENT_HEIGHT = 0.022

/** Elements stand on y = 0, so the scene drops half an element to sit in the
 *  middle of the view rather than in its upper half. */
export const SCENE_OFFSET = [0, -ELEMENT_HEIGHT / 2, 0]

export function viewCamera(zoom) {
  return { zoom, position: VIEW_DIRECTION, near: -10, far: 10 }
}

/**
 * Pixels per metre in the element palette.
 *
 * One scale for every card, so a 6.25u key is drawn six and a quarter times
 * wider than a 1u - the same relation they have on a board and in reality. The
 * card grows with its element instead of the element shrinking to fit a fixed
 * card, which is what made a wide key's housing disappear while a small key
 * still showed one.
 */
export const PALETTE_SCALE = 3333

/** Vertical screen extent of a box at the shared elevation. */
export function screenHeight(size) {
  const [, height, depth] = size
  return depth * Math.sin(ELEVATION) + height * Math.cos(ELEVATION)
}
