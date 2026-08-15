import { useState } from 'react'
import AppShell from '../components/AppShell'
import { SettingsProvider } from '../contexts/SettingsProvider'
import HomePage from './HomePage'
import SettingsPage from './SettingsPage'

const PAGES = {
  home: HomePage,
  settings: SettingsPage,
}

export function App() {
  const [page, setPage] = useState('home')
  const Page = PAGES[page] ?? HomePage

  return (
    <SettingsProvider>
      <AppShell page={page} onNavigate={setPage}>
        <Page />
      </AppShell>
    </SettingsProvider>
  )
}

export default App
