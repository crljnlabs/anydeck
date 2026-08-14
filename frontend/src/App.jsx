import { useState } from 'react'
import AnydeckIcon, { ACCENT_SETS, SURFACE_SETS } from './components/AnydeckIcon'
import './App.css'

function App() {
  const [surface, setSurface] = useState('auto')
  const [accent, setAccent] = useState('orange')

  return (
    <main className="stage">
      <AnydeckIcon surface={surface} accent={accent} />

      <div className="stage-hint">Hover, focus or hold the key</div>

      <div className="stage-sets">
        <Switch options={SURFACE_SETS} value={surface} onChange={setSurface} />
        <Switch options={ACCENT_SETS} value={accent} onChange={setAccent} />
      </div>
    </main>
  )
}

function Switch({ options, value, onChange }) {
  return (
    <div className="switch">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          data-on={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default App
