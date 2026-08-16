import { useCallback, useState } from 'react'
import AppShell from '../components/AppShell'
import { SettingsProvider } from '../contexts/settings'
import HomePage from './HomePage'
import DevicesPage from './DevicesPage'
import DevicePage from './DevicePage'
import ActionsPage from './ActionsPage'
import SettingsPage from './SettingsPage'

const PAGES = {
  home: HomePage,
  devices: DevicesPage,
  device: DevicePage,
  actions: ActionsPage,
  settings: SettingsPage,
}

/**
 * Which screen is showing, and what it is showing it for.
 *
 * Still not a router: this is a desktop window with a handful of screens, no
 * URL to keep in sync and no back button to honour. A page name and a bag of
 * parameters covers everything so far - `device` needs an id, the rest need
 * nothing.
 */
export function App() {
  const [route, setRoute] = useState({ name: 'home', params: {} })

  const navigate = useCallback(
    (name, params = {}) => setRoute({ name, params }),
    [],
  )

  const Page = PAGES[route.name] ?? HomePage

  return (
    <SettingsProvider>
      <AppShell route={route} onNavigate={navigate}>
        <Page {...route.params} navigate={navigate} />
      </AppShell>
    </SettingsProvider>
  )
}

export default App
