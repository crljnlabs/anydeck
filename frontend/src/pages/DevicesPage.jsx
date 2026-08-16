import { useEffect, useState } from 'react'
import { useSettings } from '../contexts/settings'
import { DeviceBoard, gridLayout } from '../components/DeviceBoard'
import { ContextMenu } from '../components/ContextMenu'
import { registerSearchProvider, matches } from '../lib/search/search-registry'
import { MOCK_DEVICES } from '../lib/mock/devices'
import './styles/DevicesPage.scss'

/** Right-click on a card. Rename first because it is the one people reach for. */
const CARD_MENU = [
  { id: 'rename', label: 'Rename' },
  { id: 'open', label: 'Open', hint: 'Enter' },
  { id: 'separator-1', separator: true },
  { id: 'identify', label: 'Identify', hint: 'flashes its LEDs' },
  { id: 'duplicate', label: 'Duplicate layout' },
  { id: 'export', label: 'Export layout…' },
  { id: 'separator-2', separator: true },
  { id: 'forget', label: 'Forget device', tone: 'danger' },
]

/**
 * Everything that has ever been plugged in, connected or not.
 *
 * Disconnected devices stay in the list on purpose: their mapping is still
 * yours, and a device that vanished from the screen the moment its cable came
 * loose would take its configuration with it.
 *
 * Data is mocked - see lib/mock/devices.js.
 */
export function DevicesPage({ navigate }) {
  const { element } = useSettings()
  const [menu, setMenu] = useState(null)
  const [note, setNote] = useState(null)

  useEffect(
    () =>
      registerSearchProvider({
        id: 'devices',
        group: 'Devices',
        context: 'devices',
        search: (query) =>
          MOCK_DEVICES.filter((device) =>
            matches(query, device.name, device.serial),
          ).map((device) => ({
            id: `device:${device.id}`,
            title: device.name,
            subtitle: device.connected ? 'Connected' : 'Not connected',
            run: () => navigate('device', { id: device.id }),
          })),
      }),
    [navigate],
  )

  return (
    <div className="devices-page">
      <header>
        <div>
          <h1>Devices</h1>
          <p>{MOCK_DEVICES.filter((d) => d.connected).length} connected</p>
        </div>
        <button type="button" className="primary-action" onClick={() => setNote('Searching…')}>
          Search for devices
        </button>
      </header>

      {note ? <p className="devices-note">{note}</p> : null}

      <div className="device-cards">
        {MOCK_DEVICES.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            accent={element}
            onOpen={() => navigate('device', { id: device.id })}
            onMenu={(at) => setMenu({ at, device })}
          />
        ))}
      </div>

      {menu ? (
        <ContextMenu
          at={menu.at}
          items={CARD_MENU}
          onSelect={(id) => {
            if (id === 'open') navigate('device', { id: menu.device.id })
            else setNote(`${id} on ${menu.device.name} - not wired up yet`)
          }}
          onClose={() => setMenu(null)}
        />
      ) : null}
    </div>
  )
}

function DeviceCard({ device, accent, onOpen, onMenu }) {
  const elements = gridLayout(
    device.elements.map((item) => ({
      key: item.id,
      typeId: item.typeId,
      label: item.name,
      cell: item.cell,
    })),
  )

  return (
    <button
      type="button"
      className="device-card"
      data-connected={device.connected}
      onClick={onOpen}
      onContextMenu={(event) => {
        event.preventDefault()
        onMenu({ x: event.clientX, y: event.clientY })
      }}
    >
      {/* A picture of the device, not a control - clicks belong to the card. */}
      <DeviceBoard
        elements={elements}
        accent={accent.accent}
        housing={accent.housing}
        interactive={false}
        cellSize={11}
        padding={16}
      />

      <span className="device-card-title">
        <strong>{device.name}</strong>
        <small>
          {device.elements.length} elements
          {device.connected ? '' : ' · not connected'}
        </small>
      </span>
    </button>
  )
}

export default DevicesPage
