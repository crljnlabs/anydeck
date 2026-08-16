import { useEffect, useState } from 'react'
import { useSettings } from '../contexts/settings'
import { ACCENTS, ACCENT_IDS, THEMES } from '../lib/theme/appearance'
import { LANGUAGES, LANGUAGE_IDS, LANGUAGE_FLAGS } from '../lib/i18n'
import './styles/SettingsPage.scss'

/**
 * Settings, wired to the backend through SettingsContext.
 *
 * Every control writes through the same `update` call and takes effect
 * immediately - there is no save button, because there is nothing here that
 * needs confirming and a preference that only applies after a save is a
 * preference you cannot preview.
 */
export function SettingsPage() {
  const { theme, accent, language, update, t } = useSettings()

  return (
    <div className="settings-page">
      <h1>{t('settings.title')}</h1>

      <section className="settings-group">
        <h2>{t('settings.appearance')}</h2>

        <Row label={t('settings.theme')}>
          <div className="segmented">
            {THEMES.map((option) => (
              <button
                key={option}
                type="button"
                data-on={theme === option}
                onClick={() => update({ theme: option })}
              >
                {t(`settings.theme.${option}`)}
              </button>
            ))}
          </div>
        </Row>

        <Row label={t('settings.accent')}>
          <div className="swatches">
            {ACCENT_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className="swatch"
                data-on={accent === id}
                style={{ '--swatch': ACCENTS[id].color }}
                aria-label={id}
                title={id}
                onClick={() => update({ accent: id })}
              />
            ))}
          </div>
        </Row>
      </section>

      <AutostartGroup />

      <section className="settings-group">
        <h2>{t('settings.language')}</h2>

        <Row label={t('settings.language')}>
          <div className="language-choice">
            {LANGUAGE_IDS.map((id) => {
              const Flag = LANGUAGE_FLAGS[id]
              return (
                <button
                  key={id}
                  type="button"
                  data-on={language === id}
                  onClick={() => update({ language: id })}
                >
                  <Flag />
                  <span>{LANGUAGES[id].label}</span>
                </button>
              )
            })}
          </div>
        </Row>
      </section>
    </div>
  )
}

/**
 * Whether anydeck starts with the system.
 *
 * Its own component with its own fetch rather than part of the settings
 * context: this is not a stored preference but the live state of something
 * outside the app - a login item the user can also remove in the operating
 * system's own settings. Reading it on open keeps the switch honest.
 */
function AutostartGroup() {
  const { t } = useSettings()
  const [state, setState] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/autostart')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) setState(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Hidden rather than disabled where the platform cannot offer it - a switch
  // that does nothing is worse than no switch.
  if (!state?.supported) return null

  function toggle() {
    const enabled = !state.enabled
    setState({ ...state, enabled })
    fetch('/api/autostart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    })
      .then((response) => (response.ok ? response.json() : null))
      // The operating system has the last word: if the write did not take, the
      // switch goes back rather than lying about it.
      .then((data) => data && setState(data))
      .catch(() => setState((current) => ({ ...current, enabled: !enabled })))
  }

  return (
    <section className="settings-group">
      <h2>{t('settings.system')}</h2>
      <Row label={t('settings.autostart')} hint={t('settings.autostartHint')}>
        <button
          type="button"
          className="switch-toggle"
          role="switch"
          aria-checked={state.enabled}
          data-on={state.enabled}
          onClick={toggle}
        >
          <span />
        </button>
      </Row>
    </section>
  )
}

function Row({ label, hint, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">
        <span>{label}</span>
        {hint ? <small>{hint}</small> : null}
      </div>
      {children}
    </div>
  )
}

export default SettingsPage
