import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Box3, Vector3 } from 'three'

const CORNER = new Vector3()

/**
 * Zoom an orthographic camera so one element fills its card.
 *
 * Measured from the model, not from its grid footprint. A footprint is rounded
 * to whole cells and describes the space an element claims on a board, which is
 * not what it looks like: an LED claims one 4.75 mm cell but is a 10 mm blob,
 * and a 6.25u key claims 25 cells across and 4 deep, so fitting by the larger
 * of the two drew it as a sliver.
 *
 * This is only right for the palette. Elements there are shown one per card, so
 * each may have its own scale - the point is to see what a type looks like. On
 * a board they share one scale, because there the point is how they compare.
 */
export function FitCamera({ target, padding = 0.78 }) {
  const { camera, size } = useThree()

  useLayoutEffect(() => {
    const object = target.current
    if (!object) return

    // Measure where the model actually is, then move it so its own centre sits
    // at the origin the camera looks at. Elements are modelled standing on
    // y = 0 with wildly different heights and widths, so no fixed offset can
    // centre all of them.
    object.position.set(0, 0, 0)
    object.updateWorldMatrix(false, true)

    const bounds = new Box3().setFromObject(object)
    if (bounds.isEmpty()) return

    const centre = bounds.getCenter(new Vector3())
    object.position.set(-centre.x, -centre.y, -centre.z)

    // Extent as the camera sees it. The camera looks down at an angle, so the
    // world bounding box is not the on-screen one - the corners have to go
    // through the view matrix first.
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (let i = 0; i < 8; i++) {
      CORNER.set(
        i & 1 ? bounds.max.x : bounds.min.x,
        i & 2 ? bounds.max.y : bounds.min.y,
        i & 4 ? bounds.max.z : bounds.min.z,
      ).applyMatrix4(camera.matrixWorldInverse)
      minX = Math.min(minX, CORNER.x)
      maxX = Math.max(maxX, CORNER.x)
      minY = Math.min(minY, CORNER.y)
      maxY = Math.max(maxY, CORNER.y)
    }

    const zoom = Math.min(
      size.width / Math.max(maxX - minX, 1e-6),
      size.height / Math.max(maxY - minY, 1e-6),
    )

    camera.zoom = zoom * padding
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, target, padding])

  return null
}

export default FitCamera
