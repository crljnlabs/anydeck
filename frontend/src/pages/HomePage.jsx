import { useSettings } from '../contexts/use-settings'
import {
  ELEMENT_TYPE_LIST,
  DeviceBoard,
  ElementCard,
  gridLayout,
  preloadElementModels,
} from '../components/DeviceElement'
import { ELEMENT_MENU_ITEMS } from '../components/RadialMenu'
import './styles/HomePage.scss'

preloadElementModels()

// A rough macropad, to see the elements at the spacing real hardware has.
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
        <DeviceBoard elements={DEVICE} accent={accentColor} menu={ELEMENT_MENU_ITEMS} />
      </section>
    </div>
  )
}

export default HomePage
