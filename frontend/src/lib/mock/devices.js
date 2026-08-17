/**
 * Stand-in data, shaped like what the backend will actually store.
 *
 * The point of this file is the shape, not the contents. It is the first
 * concrete answer to "what goes in the database", and the screens are built
 * against it so that the answer gets tested by use rather than by guessing:
 *
 *     device    what is plugged in - identified by what USB reports, because a
 *               name can change and a serial number cannot
 *       element one physical part of it, at a position on the device's grid
 *         hook  what should happen when that element reports something
 *
 * A hook points at an action by id rather than describing it, because the same
 * action is meant to be reused across devices - see `integrations`.
 *
 * Profiles sit between the device and its hooks: a hook belongs to exactly one
 * profile, so the same key can copy in one and switch scenes in another. A
 * profile may name an application, in which case it takes over while that
 * application is in front - which is the reason profiles exist at all.
 *
 * An output has no hooks. What it needs instead is the other direction: a rule
 * that says which state it should show. `feedback` is that, and it is why an
 * LED entry looks nothing like a key entry.
 */

export const MOCK_DEVICES = [
  {
    id: 'dev-macropad-6',
    name: 'Macropad',
    connected: true,
    // What the operating system reports. The serial is what makes this device
    // this device across replugs; the rest is only useful for display.
    vendorId: 0x303a,
    productId: 0x1001,
    serial: 'ANY-0001-4F2A',
    firmware: '0.3.1',
    lastSeenAt: '2026-08-16T19:42:00Z',
    activeProfileId: 'pr-default',
    profiles: [
      { id: 'pr-default', name: 'Default', appliesTo: null },
      { id: 'pr-obs', name: 'Streaming', appliesTo: 'OBS Studio' },
    ],
    elements: [
      { id: 'el-1', name: 'Copy', typeId: 'keycap-standard-1u', cell: [0, 0], rotation: 0,
        hooks: [
          { id: 'hk-1', profileId: 'pr-default', trigger: 'press', actionId: 'act-hotkey-copy' },
          { id: 'hk-1b', profileId: 'pr-obs', trigger: 'press', actionId: 'act-ha-desk-light' },
        ] },
      { id: 'el-2', name: 'Paste', typeId: 'keycap-standard-1u', cell: [5, 0], rotation: 0,
        hooks: [{ id: 'hk-2', profileId: 'pr-default', trigger: 'press', actionId: 'act-hotkey-paste' }] },
      { id: 'el-3', name: 'Mute', typeId: 'keycap-standard-1u', cell: [10, 0], rotation: 0,
        hooks: [{ id: 'hk-3', profileId: 'pr-default', trigger: 'press', actionId: 'act-mute' }] },
      { id: 'el-4', name: 'Volume', typeId: 'rotary-encoder', cell: [15, 0], rotation: 0,
        hooks: [
          { id: 'hk-4', profileId: 'pr-default', trigger: 'turn-left', actionId: 'act-volume-down' },
          { id: 'hk-5', profileId: 'pr-default', trigger: 'turn-right', actionId: 'act-volume-up' },
        ] },
      { id: 'el-5', name: 'Desk light', typeId: 'keycap-standard-2u', cell: [0, 5], rotation: 0,
        hooks: [{ id: 'hk-6', profileId: 'pr-default', trigger: 'press', actionId: 'act-ha-desk-light' }] },
      { id: 'el-6', name: 'Recording', typeId: 'led-indicator', cell: [10, 5], rotation: 0,
        hooks: [],
        // The reverse of a hook: the PC drives this, so what it needs is a
        // source of truth to display, not a trigger to react to.
        feedback: { source: 'int-obs', state: 'recording', onColor: '#ef4444' } },
      { id: 'el-7', name: 'Mic gain', typeId: 'slider-fader', cell: [13, 5], rotation: 0,
        hooks: [{ id: 'hk-7', profileId: 'pr-default', trigger: 'change', actionId: 'act-mic-gain' }] },
    ],
  },
  {
    id: 'dev-keypad-num',
    name: 'Numpad',
    connected: true,
    vendorId: 0x303a,
    productId: 0x1002,
    serial: 'ANY-0002-91C7',
    firmware: '0.3.1',
    lastSeenAt: '2026-08-16T19:44:00Z',
    activeProfileId: 'pr-num-default',
    profiles: [{ id: 'pr-num-default', name: 'Default', appliesTo: null }],
    elements: [
      { id: 'el-10', name: 'Key 1', typeId: 'keycap-standard-1u', cell: [0, 0], rotation: 0, hooks: [] },
      { id: 'el-11', name: 'Key 2', typeId: 'keycap-standard-1u', cell: [5, 0], rotation: 0, hooks: [] },
      { id: 'el-12', name: 'Key 3', typeId: 'keycap-standard-1u', cell: [0, 5], rotation: 0, hooks: [] },
      { id: 'el-13', name: 'Key 4', typeId: 'keycap-standard-1u', cell: [5, 5], rotation: 0, hooks: [] },
      { id: 'el-14', name: 'Enter', typeId: 'keycap-standard-2u', cell: [10, 0], rotation: 0, hooks: [] },
      { id: 'el-15', name: 'Screen', typeId: 'display-screen', cell: [10, 5], rotation: 0, hooks: [],
        // Reported by the device rather than chosen here - the panel is what it
        // is. Anything drawn on it has to be rendered at this size.
        resolution: [128, 64],
        feedback: { source: 'int-system', state: 'now-playing' } },
    ],
  },
  {
    id: 'dev-deck-wide',
    name: 'Stream bar',
    connected: false,
    vendorId: 0x303a,
    productId: 0x1003,
    serial: 'ANY-0003-2D18',
    firmware: '0.2.9',
    lastSeenAt: '2026-08-14T08:12:00Z',
    activeProfileId: 'pr-bar-default',
    profiles: [{ id: 'pr-bar-default', name: 'Default', appliesTo: null }],
    elements: [
      { id: 'el-20', name: 'Space', typeId: 'keycap-standard-6-25u', cell: [0, 0], rotation: 0, hooks: [] },
      { id: 'el-21', name: 'Scene', typeId: 'toggle-switch', cell: [0, 5], rotation: 0, hooks: [] },
      { id: 'el-22', name: 'Pan', typeId: 'joystick', cell: [4, 5], rotation: 0, hooks: [] },
      { id: 'el-23', name: 'Level', typeId: 'potentiometer', cell: [9, 5], rotation: 0, hooks: [] },
    ],
  },
]

/**
 * What the Actions screen manages: not single actions, but the sources they
 * come from. Connecting Home Assistant yields many actions at once; a hotkey
 * needs no connecting at all. That difference is why this is a separate list
 * rather than a flat one.
 */
export const MOCK_INTEGRATIONS = [
  {
    id: 'int-hotkeys', name: 'Keyboard shortcuts', kind: 'builtin',
    description: 'Send a key combination to whatever is in front.',
    connected: true, actionCount: 12, needsAuth: false,
  },
  {
    id: 'int-system', name: 'System', kind: 'builtin',
    description: 'Volume, media keys, sleep, screenshots.',
    connected: true, actionCount: 9, needsAuth: false,
  },
  {
    id: 'int-launch', name: 'Applications', kind: 'builtin',
    description: 'Start a program or open a file.',
    connected: true, actionCount: 4, needsAuth: false,
  },
  {
    id: 'int-sounds', name: 'Sounds', kind: 'builtin',
    description: 'Play an audio file on a chosen output.',
    connected: true, actionCount: 3, needsAuth: false,
  },
  {
    id: 'int-home-assistant', name: 'Home Assistant', kind: 'service',
    description: 'Switches, lights and scenes from your own instance.',
    connected: false, actionCount: 0, needsAuth: true,
  },
  {
    id: 'int-obs', name: 'OBS Studio', kind: 'service',
    description: 'Scene switching, recording and streaming controls.',
    connected: false, actionCount: 0, needsAuth: true,
  },
  {
    id: 'int-spotify', name: 'Spotify', kind: 'service',
    description: 'Playback control and playlists.',
    connected: false, actionCount: 0, needsAuth: true,
  },
]

/** Actions the mock hooks point at, so a hook can show a name rather than an id. */
export const MOCK_ACTIONS = {
  'act-hotkey-copy': { id: 'act-hotkey-copy', label: 'Copy', integrationId: 'int-hotkeys' },
  'act-hotkey-paste': { id: 'act-hotkey-paste', label: 'Paste', integrationId: 'int-hotkeys' },
  'act-mute': { id: 'act-mute', label: 'Mute microphone', integrationId: 'int-system' },
  'act-volume-up': { id: 'act-volume-up', label: 'Volume up', integrationId: 'int-system' },
  'act-volume-down': { id: 'act-volume-down', label: 'Volume down', integrationId: 'int-system' },
  'act-ha-desk-light': { id: 'act-ha-desk-light', label: 'Desk light', integrationId: 'int-home-assistant' },
  'act-mic-gain': { id: 'act-mic-gain', label: 'Microphone gain', integrationId: 'int-system' },
}

export function mockDevice(id) {
  return MOCK_DEVICES.find((device) => device.id === id) ?? null
}
