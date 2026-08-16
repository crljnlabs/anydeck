import { useEffect, useState } from 'react'
import AnydeckIcon from '../AnydeckIcon'
import { useSettings } from '../../contexts/settings'
import { registerSearchProvider, matches } from '../../lib/search/search-registry'
import GlobalSearch from './GlobalSearch'
import UserBadge from './UserBadge'
import { HomeIcon, SettingsIcon, SidebarIcon } from './shell-icons'
import './app-shell.scss'

const NAV = [
  { id: 'home', labelKey: 'nav.home', Icon: HomeIcon },
  { id: 'settings', labelKey: 'nav.settings', Icon: SettingsIcon },
]

const SIDEBAR_KEY = 'anydeck.sidebar.collapsed'

/**
 * The frame every screen sits in: header on top, collapsible navigation on the
 * left, the active page filling the rest.
 *
 * The shell owns which page is showing rather than a router, because the app is
 * a desktop window with a fixed handful of screens - there is no URL to keep in
 * sync and no back button to honour. Should that change, this is the one place
 * that has to know.
 */
export function AppShell({ page, onNavigate, children }) {
  const { accentColor, theme, t } = useSettings()
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === 'true',
  )

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(collapsed))
  }, [collapsed])

  // The navigation is the first thing global search can find. It registers
  // itself the same way every later feature will, so the pattern is in use
  // rather than only described.
  useEffect(
    () =>
      registerSearchProvider({
        id: 'navigation',
        group: 'Navigation',
        search: (query) =>
          NAV.filter((entry) => matches(query, t(entry.labelKey), entry.id)).map(
            (entry) => ({
              id: `nav:${entry.id}`,
              title: t(entry.labelKey),
              run: () => onNavigate(entry.id),
            }),
          ),
      }),
    [t, onNavigate],
  )

  return (
    <div className="app-shell" data-collapsed={collapsed}>
      <header className="app-header">
        <div className="app-brand">
          {/* The logo follows the app's own accent and theme - it was the one
              thing still showing a colour the user had not chosen. */}
          <AnydeckIcon
            size={56}
            accent={accentColor}
            surface={theme === 'system' ? 'auto' : theme}
          />
          {/* Reads as "anydeck": the A is the letter on the keycap in the
              logo, so the word carries on from the icon. It is part of the
              brand block, so it disappears together with the sidebar. */}
          <span className="app-brand-name">{t('app.name')}</span>
        </div>

        <GlobalSearch />

        <UserBadge />
      </header>

      <div className="app-body">
        <nav className="app-sidebar" aria-label={t('nav.home')}>
          <ul>
            {NAV.map(({ id, labelKey, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  data-active={page === id}
                  title={collapsed ? t(labelKey) : undefined}
                  onClick={() => onNavigate(id)}
                >
                  <Icon />
                  <span>{t(labelKey)}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="app-sidebar-toggle"
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
            title={collapsed ? t('nav.expand') : t('nav.collapse')}
            onClick={() => setCollapsed((value) => !value)}
          >
            <SidebarIcon />
            <span>{t('nav.collapse')}</span>
          </button>
        </nav>

        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
