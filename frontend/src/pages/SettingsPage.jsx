import { useSettings } from '../contexts/use-settings'
import { ACCENTS, ACCENT_IDS, THEMES } from '../theme/appearance'
import { LANGUAGES, LANGUAGE_IDS } from '../i18n/translations'
import { LANGUAGE_FLAGS } from '../i18n/language-flags'
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

      <section className="settings-group">
        <h2>{t('settings.language')}</h2>

        <Row label={t('settings.language')} hint={t('settings.languageHint')}>
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
