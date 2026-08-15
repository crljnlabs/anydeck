/**
 * Icons for the radial menu.
 *
 * Drawn inline rather than pulled from an icon package: the app has to work
 * offline in a packaged window, and three glyphs are not worth a dependency.
 * Each one is a 24x24 stroke icon inheriting `currentColor`, so a menu entry
 * only has to set a colour to restyle its icon.
 */

function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Assign an action to the element - the primary entry. */
export function BoltIcon(props) {
  return (
    <Icon {...props}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
    </Icon>
  )
}

/** Rename the element. */
export function PencilIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z" />
      <path d="M14.5 6.5 17.5 9.5" />
    </Icon>
  )
}

/** Remove the element from the device. */
export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M6.5 7 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7" />
      <path d="M10.5 11v6M13.5 11v6" />
    </Icon>
  )
}
