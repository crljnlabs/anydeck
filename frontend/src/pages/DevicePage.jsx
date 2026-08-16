import { useMemo, useState } from 'react'
import { useSettings } from '../contexts/settings'
import { DeviceBoard, gridLayout } from '../components/DeviceBoard'
import { ELEMENT_TYPES, ELEMENT_TYPE_LIST, elementType } from '../components/DeviceElement'
import { BoltIcon, PencilIcon, TrashIcon } from '../components/RadialMenu'
import { MOCK_ACTIONS, mockDevice } from '../lib/mock/devices'
import './styles/DevicePage.scss'

/** The ring on an element. "Attributes" is the way into the panel on the right. */
const ELEMENT_MENU = [
  { id: 'action', label: 'Action', icon: <BoltIcon /> },
  { id: 'attributes', label: 'Attributes', icon: <PencilIcon /> },
  { id: 'remove', label: 'Remove', icon: <TrashIcon />, tone: 'danger' },
]

/**
 * One device, laid out and configurable.
 *
 * The panel on the right is the properties grid: whatever is selected, its
 * attributes are here. Nothing is saved - this is mock data, built to work out
 * what the database will have to hold.
 */
export function DevicePage({ id, navigate }) {
  const { element: palette } = useSettings()
  const device = mockDevice(id)
  const [selectedId, setSelectedId] = useState(device?.elements[0]?.id ?? null)

  const elements = useMemo(
    () =>
      device
        ? gridLayout(
            device.elements.map((item) => ({
              key: item.id,
              typeId: item.typeId,
              label: item.name,
              cell: item.cell,
            })),
          )
        : [],
    [device],
  )

  if (!device) {
    return (
      <div className="device-page-missing">
        <p>That device is not here any more.</p>
        <button type="button" onClick={() => navigate('devices')}>
          Back to devices
        </button>
      </div>
    )
  }

  const selected = device.elements.find((item) => item.id === selectedId) ?? null

  return (
    <div className="device-page">
      <div className="device-stage">
        <header>
          <button type="button" className="link-back" onClick={() => navigate('devices')}>
            ← Devices
          </button>
          <h1>{device.name}</h1>
          <p>
            {device.connected ? 'Connected' : 'Not connected'} · {device.serial} ·
            firmware {device.firmware}
          </p>
        </header>

        <DeviceBoard
          elements={elements}
          accent={palette.accent}
          housing={palette.housing}
          menu={ELEMENT_MENU}
          onMenuSelect={(_action, _item, chosen) => setSelectedId(chosen?.key ?? null)}
          cellSize={22}
        />

        <p className="device-hint">
          Click an element for its ring. Dragging elements around the grid is not
          built yet.
        </p>
      </div>

      <AttributesPanel element={selected} onSelect={setSelectedId} device={device} />
    </div>
  )
}

/**
 * The properties panel, in the shape a properties grid has: rows of name and
 * value, grouped, with a description of whatever is focused at the bottom.
 *
 * Actions sit in their own group because they are the one part that is a list
 * rather than a value - an element can have several, one per trigger.
 */
function AttributesPanel({ element, device, onSelect }) {
  if (!element) {
    return (
      <aside className="attributes-panel">
        <p className="attributes-empty">Select an element to see its attributes.</p>
      </aside>
    )
  }

  const type = elementType(element.typeId)

  return (
    <aside className="attributes-panel">
      <div className="attributes-head">
        <select
          value={element.id}
          onChange={(event) => onSelect(event.target.value)}
          aria-label="Element"
        >
          {device.elements.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — {elementType(item.typeId).label}
            </option>
          ))}
        </select>
      </div>

      <Group title="Design">
        <Row label="Name" value={<input defaultValue={element.name} />} />
        <Row
          label="Element"
          value={
            <select defaultValue={element.typeId}>
              {ELEMENT_TYPE_LIST.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          }
          hint="Change this when a part was recognised as the wrong kind."
        />
        <Row label="Position" value={<code>{element.cell.join(', ')}</code>} />
        <Row label="Rotation" value={<code>{element.rotation}°</code>} />
      </Group>

      <Group title="Behaviour">
        <Row label="Kind" value={<code>{type.kind}</code>} />
        <Row
          label="Reports"
          value={
            type.triggers.length ? (
              <code>{type.triggers.join(', ')}</code>
            ) : (
              <em>nothing — this one is driven by the PC</em>
            )
          }
        />
      </Group>

      <div className="attributes-actions">
        <div className="attributes-actions-head">
          <h3>Actions</h3>
          <button type="button" disabled={!type.triggers.length}>
            Add
          </button>
        </div>

        {type.kind === 'output' ? (
          <p className="attributes-note">
            An output has no actions. It is told what to show — which state
            drives it is the setting it will need instead.
          </p>
        ) : element.hooks.length === 0 ? (
          <p className="attributes-note">Nothing hooked up yet.</p>
        ) : (
          <ul>
            {element.hooks.map((hook) => (
              <li key={hook.id}>
                <span className="hook-trigger">{hook.trigger}</span>
                <span className="hook-action">
                  {MOCK_ACTIONS[hook.actionId]?.label ?? hook.actionId}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="attributes-description">
        {ELEMENT_TYPES[element.typeId]?.description ?? ''}
      </p>
    </aside>
  )
}

function Group({ title, children }) {
  return (
    <section className="attributes-group">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

function Row({ label, value, hint }) {
  return (
    <div className="attributes-row" title={hint}>
      <span>{label}</span>
      <div>{value}</div>
    </div>
  )
}

export default DevicePage
