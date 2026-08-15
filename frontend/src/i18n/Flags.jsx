/**
 * Flags used as the language icons.
 *
 * Inline SVG for the same reason as the menu icons: the app has to work with no
 * network, and emoji flags are unreliable - Windows renders them as letter
 * pairs rather than flags.
 *
 * A flag is a rough stand-in for a language, not a correct one (English is not
 * only spoken in Britain). It is used here because the settings screen asks for
 * one recognisable icon per choice, and the language name sits next to it.
 */

function Flag({ children, title }) {
  return (
    <svg viewBox="0 0 20 14" role="img" aria-label={title} className="flag">
      <rect width="20" height="14" rx="2" fill="#fff" />
      {children}
      <rect
        width="20"
        height="14"
        rx="2"
        fill="none"
        stroke="rgb(0 0 0 / 0.18)"
        strokeWidth="1"
      />
    </svg>
  )
}

export function FlagDE(props) {
  return (
    <Flag title="Deutsch" {...props}>
      <rect width="20" height="4.67" y="0" fill="#000" />
      <rect width="20" height="4.67" y="4.67" fill="#dd0000" />
      <rect width="20" height="4.66" y="9.34" fill="#ffce00" />
    </Flag>
  )
}

export function FlagEN(props) {
  return (
    <Flag title="English" {...props}>
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.8" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#c8102e" strokeWidth="1.6" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.6" />
      <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.6" />
    </Flag>
  )
}
