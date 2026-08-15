import { useState } from 'react'
import AnydeckIcon from './components/AnydeckIcon'
import {
  ELEMENT_TYPE_LIST,
  DeviceBoard,
  ElementCard,
  gridLayout,
  preloadElementModels,
} from './components/DeviceElement'
import { ELEMENT_MENU_ITEMS } from './components/RadialMenu'
import './App.css'

preloadElementModels()

// Roughly the shape of a real macropad, at true hardware spacing, to show the
// elements as close together as they will actually sit.
const DEVICE = gridLayout(
  [
    'keycap-standard-1u',
    'keycap-standard-1u',
    'keycap-standard-1u',
    'rotary-encoder',
    'keycap-standard-1u',
    'keycap-standard-1u',
    'keycap-standard-1u',
    'led-indicator',
  ],
  { columns: 4 },
)

function App() {
  const [selection, setSelection] = useState(null)

  return (
    <main className="stage">
      <header className="stage-head">
        <AnydeckIcon size={72} interactive={false} />
        <h1>Device elements</h1>
      </header>

      <section className="panel">
        <h2>Click an element</h2>
        <p className="panel-hint">
          Each type plays its own motion: keys press, knobs turn, the switch
          latches, the LED lights up.
        </p>
        <div className="element-grid">
          {ELEMENT_TYPE_LIST.map((type) => (
            <ElementCard key={type.id} typeId={type.id} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Click an element on the device</h2>
        <p className="panel-hint">
          The same elements at real spacing on one shared canvas, with a radial
          menu. The ring paints over the neighbouring elements instead of being
          clipped by them.
        </p>
        <DeviceBoard
          elements={DEVICE}
          menu={ELEMENT_MENU_ITEMS}
          onMenuSelect={(id, item, element) =>
            setSelection(`${item.label} - ${element?.label ?? 'element'}`)
          }
        />
        <p className="panel-result" aria-live="polite">
          {selection ? `Selected: ${selection}` : 'Nothing selected yet'}
        </p>
      </section>
    </main>
  )
}

export default App
