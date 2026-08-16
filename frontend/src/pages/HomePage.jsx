import { useSettings } from '../contexts/settings'
import { ELEMENT_TYPE_LIST, preloadElementModels } from '../components/DeviceElement'
import { ElementCard } from '../components/ElementCard'
import { DeviceBoard, gridLayout } from '../components/DeviceBoard'
import { ELEMENT_MENU_ITEMS } from '../components/RadialMenu'
import './styles/HomePage.scss'

preloadElementModels()

// A macropad with elements of genuinely different footprints, so the grid has
// something to do: the display takes a 2x2 block, the fader three cells.
const DEVICE = gridLayout(
  [
    'keycap-standard-1u',
    'keycap-standard-1u',
    'keycap-standard-1u',
    'rotary-encoder',
    'keycap-standard-2u',
    'toggle-switch',
    'led-indicator',
    'slider-fader',
    'display-screen',
    'keycap-standard-1u',
    'keycap-standard-1u',
  ],
  { columns: 4 },
)

/** Scratch page: whatever is being tried out at the moment lives here. */
export function HomePage() {
  const { accentColor, t } = useSettings()

  return (
    <div className="home-page">
      <header>
        <h1>{t('home.title')}</h1>
        <p>{t('home.hint')}</p>
      </header>

      <section>
        <div className="element-grid">
          {ELEMENT_TYPE_LIST.map((type) => (
            <ElementCard key={type.id} typeId={type.id} accent={accentColor} />
          ))}
        </div>
      </section>

      <section>
        <h2>Editable</h2>
        <DeviceBoard elements={DEVICE} accent={accentColor} menu={ELEMENT_MENU_ITEMS} />
      </section>

      <section>
        <h2>Display only</h2>
        <DeviceBoard elements={DEVICE} accent={accentColor} interactive={false} />
      </section>
    </div>
  )
}

export default HomePage
