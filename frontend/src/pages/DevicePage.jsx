import { useCallback, useMemo, useState } from 'react'
import { useSettings } from '../contexts/settings'
import { DeviceBoard, gridLayout } from '../components/DeviceBoard'
import { ELEMENT_TYPES, ELEMENT_TYPE_LIST, elementType } from '../components/DeviceElement'
import { BoltIcon, PencilIcon, TrashIcon } from '../components/RadialMenu'
import { MOCK_ACTIONS, MOCK_INTEGRATIONS, mockDevice } from '../lib/mock/devices'
import { ProfileAdd, ProfileNumber } from './profile-marks'
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
 * Profiles sit above everything else on this screen, because they change what
 * every other control means: the same key has one action here and another
 * there. Putting them anywhere but at the top would let someone edit the wrong
 * profile without noticing.
 */
export function DevicePage({ id, navigate }) {
  const { element: palette } = useSettings()
  const device = mockDevice(id)
  const [profileId, setProfileId] = useState(device?.activeProfileId ?? null)
  const [selectedId, setSelectedId] = useState(device?.elements[0]?.id ?? null)
  // The panel shows whichever of the two was touched last. Selecting a profile
  // and selecting an element are the same gesture from the user's side, so they
  // share one place to land.
  const [showing, setShowing] = useState('element')

  // Where the elements sit. Held here rather than in the board, because it is
  // the device that has an arrangement - the board only draws one. This is the
  // state that will be saved per device once there is a backend to save it to.
  const [placements, setPlacements] = useState(() =>
    (device?.elements ?? []).map((item) => ({
      key: item.id,
      typeId: item.typeId,
      label: item.name,
      cell: item.cell,
      rotation: item.rotation ?? 0,
    })),
  )

  const elements = useMemo(() => gridLayout(placements), [placements])

  // The board hands back every element's cell, not just the moved one: moving
  // an element pushes its neighbours aside, so a move is a change to the whole
  // arrangement rather than to one entry in it.
  const rearrange = useCallback((next) => {
    const byKey = new Map(next.map((item) => [item.key, item]))
    setPlacements((current) =>
      current.map((item) => ({ ...item, ...byKey.get(item.key) })),
    )
  }, [])

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

  // The arrangement lives in `placements`, everything else on the device, so
  // the panel has to read the position from the one and the rest from the
  // other - otherwise it keeps reporting where an element used to be.
  const found = device.elements.find((item) => item.id === selectedId)
  const placed = placements.find((item) => item.key === selectedId)
  const selected = found ? { ...found, cell: placed?.cell ?? found.cell, rotation: placed?.rotation ?? found.rotation } : null

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

        <ProfileBar
          profiles={device.profiles}
          activeId={profileId}
          onSelect={(id) => {
            setProfileId(id)
            setShowing('profile')
          }}
        />

        <DeviceBoard
          elements={elements}
          accent={palette.accent}
          housing={palette.housing}
          menu={ELEMENT_MENU}
          onSelect={(chosen) => {
            setSelectedId(chosen.key)
            setShowing('element')
          }}
          onMenuSelect={(_action, _item, chosen) => {
            setSelectedId(chosen?.key ?? null)
            setShowing('element')
          }}
          onLayoutChange={rearrange}
          cellSize={22}
        />
      </div>

      {showing === 'profile' ? (
        <ProfilePanel
          profile={device.profiles.find((item) => item.id === profileId)}
          device={device}
        />
      ) : (
        <AttributesPanel
          element={selected}
          device={device}
          profileId={profileId}
          onSelect={setSelectedId}
        />
      )}
    </div>
  )
}

/**
 * The profile switcher.
 *
 * A new profile starts as a copy of the one showing, because that is what
 * people are actually doing: taking a working layout and changing two keys. An
 * empty profile would mean rebuilding everything to change one thing.
 */
function ProfileBar({ profiles, activeId, onSelect }) {
  return (
    <div className="profile-bar">
      {profiles.map((profile, index) => (
        <button
          key={profile.id}
          type="button"
          className="profile-chip"
          data-on={profile.id === activeId}
          title={
            profile.appliesTo
              ? `Takes over while ${profile.appliesTo} is in front`
              : profile.name
          }
          onClick={() => onSelect(profile.id)}
        >
          <ProfileNumber value={index + 1} />
          <span className="profile-name">{profile.name}</span>
          {profile.appliesTo ? <span className="profile-auto">auto</span> : null}
        </button>
      ))}

      <button
        type="button"
        className="profile-chip profile-add"
        title="New profile, copied from this one"
      >
        <ProfileAdd />
      </button>
    </div>
  )
}

/**
 * A profile's own attributes, in the same panel an element uses.
 *
 * Same shape on purpose: whatever you last touched is described on the right,
 * so there is one place to look rather than two.
 */
function ProfilePanel({ profile, device }) {
  if (!profile) {
    return (
      <aside className="attributes-panel">
        <p className="attributes-empty">No profile selected.</p>
      </aside>
    )
  }

  const isDefault = profile.id === device.activeProfileId
  const hookCount = device.elements.reduce(
    (total, element) =>
      total + (element.hooks ?? []).filter((hook) => hook.profileId === profile.id).length,
    0,
  )

  return (
    <aside className="attributes-panel">
      <div className="attributes-head">
        <span className="attributes-title">Profile</span>
      </div>

      <Group title="Design">
        <Row label="Name" value={<input key={profile.id} defaultValue={profile.name} />} />
        <Row
          label="Default"
          value={
            <label className="attributes-check">
              <input type="checkbox" defaultChecked={isDefault} />
              <span>Use when nothing else applies</span>
            </label>
          }
        />
      </Group>

      <Group title="Activation">
        <Row
          label="When"
          value={
            <select key={profile.id} defaultValue={profile.appliesTo ? 'app' : 'manual'}>
              <option value="manual">Chosen by hand</option>
              <option value="app">An application is in front</option>
            </select>
          }
        />
        <Row
          label="Application"
          value={
            <input
              key={profile.id}
              defaultValue={profile.appliesTo ?? ''}
              placeholder="e.g. OBS Studio"
            />
          }
        />
      </Group>

      <div className="attributes-actions">
        <div className="attributes-actions-head">
          <h3>Contents</h3>
          <button type="button">Duplicate</button>
        </div>
        <p className="attributes-note">
          {hookCount} {hookCount === 1 ? 'action' : 'actions'} across{' '}
          {device.elements.length} elements.
        </p>
      </div>

      <p className="attributes-description">
        A profile decides what every element on this device does. Elements and
        their positions are shared; only the actions differ.
      </p>
    </aside>
  )
}

/**
 * The properties panel: rows of name and value, grouped, with a description of
 * the selected element at the bottom.
 *
 * What it shows depends on what the element is. An input gets actions - one per
 * trigger, within the current profile. An output gets the opposite: a rule for
 * which state it should display, because nothing it does starts with the user.
 */
function AttributesPanel({ element, device, profileId, onSelect }) {
  if (!element) {
    return (
      <aside className="attributes-panel">
        <p className="attributes-empty">Select an element to see its attributes.</p>
      </aside>
    )
  }

  const type = elementType(element.typeId)
  const hooks = (element.hooks ?? []).filter((hook) => hook.profileId === profileId)
  const profile = device.profiles.find((item) => item.id === profileId)

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
        {/* Keyed by element: an uncontrolled field keeps its first value, so
            without this the name of whatever was selected first would stay in
            the box after selecting something else. */}
        <Row label="Name" value={<input key={element.id} defaultValue={element.name} />} />
        <Row
          label="Element"
          value={
            <select key={element.id} defaultValue={element.typeId}>
              {ELEMENT_TYPE_LIST.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />
        <Row label="Position" value={<code>{element.cell.join(', ')}</code>} />
        <Row label="Rotation" value={<code>{element.rotation}°</code>} />
        {element.resolution ? (
          <Row
            label="Resolution"
            value={<code>{element.resolution.join(' × ')} px</code>}
          />
        ) : null}
      </Group>

      <Group title="Behaviour">
        <Row label="Kind" value={<code>{type.kind}</code>} />
        <Row
          label="Reports"
          value={
            type.triggers.length ? (
              <code>{type.triggers.join(', ')}</code>
            ) : (
              <em>driven by the PC</em>
            )
          }
        />
      </Group>

      {type.kind === 'output' ? (
        <Feedback element={element} />
      ) : (
        <Actions hooks={hooks} profile={profile} />
      )}

      <p className="attributes-description">
        {ELEMENT_TYPES[element.typeId]?.description ?? ''}
      </p>
    </aside>
  )
}

function Actions({ hooks, profile }) {
  return (
    <div className="attributes-actions">
      <div className="attributes-actions-head">
        <h3>Actions</h3>
        <button type="button">Add</button>
      </div>

      {hooks.length === 0 ? (
        <p className="attributes-note">
          Nothing in {profile?.name ?? 'this profile'} yet.
        </p>
      ) : (
        <ul>
          {hooks.map((hook) => (
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
  )
}

/** An output runs backwards: the PC has the state, the element displays it. */
function Feedback({ element }) {
  const source = MOCK_INTEGRATIONS.find((item) => item.id === element.feedback?.source)

  return (
    <div className="attributes-actions">
      <div className="attributes-actions-head">
        <h3>Shows</h3>
        <button type="button">Change</button>
      </div>

      {element.feedback ? (
        <ul>
          <li>
            <span className="hook-trigger">when</span>
            <span className="hook-action">
              {source?.name ?? element.feedback.source} · {element.feedback.state}
            </span>
          </li>
        </ul>
      ) : (
        <p className="attributes-note">Nothing assigned.</p>
      )}
    </div>
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

function Row({ label, value }) {
  return (
    <div className="attributes-row">
      <span>{label}</span>
      <div>{value}</div>
    </div>
  )
}

export default DevicePage
