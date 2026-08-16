/**
 * Icons for the shell. Inline SVG, same reasoning as everywhere else in this
 * project: the packaged app has no network, and a handful of glyphs is not
 * worth a dependency.
 */

function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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

export function HomeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  )
}

/**
 * A gear. The outline is a real eight-tooth profile - points generated on two
 * radii around the centre - rather than a circle with rays, which is a sun.
 */
export function SettingsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M10.18 5.03 L10.46 2.73 L13.54 2.73 L13.82 5.03 L15.64 5.79 L17.47 4.35 L19.65 6.53 L18.21 8.36 L18.97 10.18 L21.27 10.46 L21.27 13.54 L18.97 13.82 L18.21 15.64 L19.65 17.47 L17.47 19.65 L15.64 18.21 L13.82 18.97 L13.54 21.27 L10.46 21.27 L10.18 18.97 L8.36 18.21 L6.53 19.65 L4.35 17.47 L5.79 15.64 L5.03 13.82 L2.73 13.54 L2.73 10.46 L5.03 10.18 L5.79 8.36 L4.35 6.53 L6.53 4.35 L8.36 5.79 Z" />
      <circle cx="12" cy="12" r="3.1" />
    </Icon>
  )
}

export function SearchIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </Icon>
  )
}

export function SidebarIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M9.5 4.5v15" />
    </Icon>
  )
}
