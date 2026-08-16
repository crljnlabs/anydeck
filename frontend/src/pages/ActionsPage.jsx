import { useState } from 'react'
import { MOCK_INTEGRATIONS } from '../lib/mock/devices'
import './styles/ActionsPage.scss'

/**
 * Where actions come from, not the actions themselves.
 *
 * The distinction is the whole point of the screen, and it is why "Actions" is
 * the wrong name for it - a better one is Sources, or Integrations. Connecting
 * Home Assistant yields dozens of actions at once and needs credentials first;
 * sending a key combination needs no connecting at all and yields one action
 * shaped by whatever the user types. Listing every individual action here would
 * be a list nobody can read, and it would hide the only thing that needs doing
 * on this screen: connecting the things that need connecting.
 *
 * Data is mocked - see lib/mock/devices.js.
 */
export function ActionsPage() {
  const [note, setNote] = useState(null)

  const builtin = MOCK_INTEGRATIONS.filter((item) => item.kind === 'builtin')
  const services = MOCK_INTEGRATIONS.filter((item) => item.kind === 'service')

  return (
    <div className="actions-page">
      <header>
        <h1>Action sources</h1>
        <p>What your elements can be made to do.</p>
      </header>

      {note ? <p className="actions-note">{note}</p> : null}

      <Section
        title="Built in"
        hint="Always available, nothing to connect."
        items={builtin}
        onConnect={setNote}
      />
      <Section
        title="Services"
        hint="Each one needs to be connected once before its actions appear."
        items={services}
        onConnect={setNote}
      />
    </div>
  )
}

function Section({ title, hint, items, onConnect }) {
  return (
    <section className="actions-section">
      <h2>{title}</h2>
      <p className="actions-section-hint">{hint}</p>

      <div className="integration-cards">
        {items.map((item) => (
          <article key={item.id} className="integration-card" data-connected={item.connected}>
            <span className="integration-mark" aria-hidden="true">
              {item.name.slice(0, 1)}
            </span>

            <div className="integration-body">
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <small>
                {item.connected
                  ? `${item.actionCount} actions available`
                  : 'Not connected'}
              </small>
            </div>

            {item.needsAuth ? (
              <button
                type="button"
                data-on={item.connected}
                onClick={() => onConnect(null)}
              >
                {item.connected ? 'Disconnect' : 'Connect'}
              </button>
            ) : (
              <button type="button" onClick={() => onConnect(null)}>
                Settings
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default ActionsPage
