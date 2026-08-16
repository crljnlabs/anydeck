import { useEffect, useState } from 'react'
import { useTranslation } from '../../contexts/settings'

/**
 * Who the app is running for.
 *
 * anydeck has no accounts and no sign-in. The operating system already knows
 * who is logged in, and that answer is the one that matters: configuration is
 * stored under the current user's own data directory, so a system-wide install
 * gives every user their own profile without anyone creating one, and without
 * one user being able to see another's mappings.
 */
export function UserBadge() {
  const t = useTranslation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/user')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setUser(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!user) return null

  // Just the initials. The name and the words "operating-system account" were
  // explaining something the user already knows, in the most valuable strip of
  // the window.
  return (
    <button
      type="button"
      className="user-badge"
      title={`${t('user.signedInAs')} ${user.display_name} (${user.username})`}
      aria-label={`${t('user.signedInAs')} ${user.display_name}`}
    >
      {initials(user.display_name, user.username)}
    </button>
  )
}

/**
 * Initials from the display name.
 *
 * Derived here rather than sent by the backend: it is presentation, it depends
 * on how much room this badge has, and a different view may well want three
 * letters or none. Nothing is stored, so there is nothing to keep in sync.
 */
function initials(displayName, username) {
  const source = displayName?.trim() || username || ''
  const parts = source.replace(/[-_.]/g, ' ').split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default UserBadge
