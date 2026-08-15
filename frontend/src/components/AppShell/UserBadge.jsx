import { useEffect, useState } from 'react'
import { useTranslation } from '../../contexts/use-settings'

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

  return (
    <div className="user-badge" title={`${t('user.signedInAs')} ${user.username}`}>
      <span className="user-badge-avatar" aria-hidden="true">
        {user.initials}
      </span>
      <span className="user-badge-name">
        <strong>{user.display_name}</strong>
        <small>{t('user.osAccount')}</small>
      </span>
    </div>
  )
}

export default UserBadge
