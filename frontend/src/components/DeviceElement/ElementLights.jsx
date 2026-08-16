/**
 * The lighting rig every element is drawn under.
 *
 * Shared between the palette and the board on purpose. They had their own
 * setups before, which meant the same key was lit one way in the list and
 * another way on the device - the highlight that made a keycap read as a
 * rounded object was only present in one of them.
 *
 * The balance matters as much as the positions. Ambient light is kept low: it
 * lifts every face equally, and once it dominates, two keys standing side by
 * side have no edge between them and a dense grid turns into one flat mass.
 * The contrast between the top face and the sides is what separates them.
 */
export function ElementLights() {
  return (
    <>
      <ambientLight intensity={0.75} />

      {/* Key light, high and to the front: makes the top faces bright and
          leaves the sides darker, which is what draws the edges. */}
      <directionalLight position={[0.06, 0.16, 0.11]} intensity={2.4} />

      {/* Rim from behind. The housing is dark, and without this it merges into
          a dark page background. */}
      <directionalLight position={[-0.09, 0.05, -0.1]} intensity={1.2} />

      {/* Just enough from below that a side facing away from both other lights
          does not go to pure black. */}
      <directionalLight position={[0.02, -0.06, 0.05]} intensity={0.35} />
    </>
  )
}

export default ElementLights
