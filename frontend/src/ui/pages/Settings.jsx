import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/useTheme'

function Settings({ installPrompt, onInstallPromptConsumed }) {
  const { logout } = useAuth()
  const { t, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const handleInstall = async () => {
    await installPrompt.prompt()
    await installPrompt.userChoice
    onInstallPromptConsumed()
  }

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <h1 className="text-xl font-bold">{t('settings.title')}</h1>
      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">{t('settings.languageTitle')}</h2>
        <button
          type="button"
          onClick={toggleLanguage}
          className="mt-3 min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold"
        >
          {`${t('language.hindi')} ⇄ ${t('language.english')}`}
        </button>
      </section>
      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">{t('settings.themeTitle')}</h2>
        <button
          type="button"
          aria-pressed={theme === 'dark'}
          onClick={toggleTheme}
          className="mt-3 min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold"
        >
          {theme === 'dark' ? t('settings.themeLight') : t('settings.themeDark')}
        </button>
      </section>
      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">{t('settings.installTitle')}</h2>
        {installPrompt ? (
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 min-h-11 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
          >
            {t('settings.installButton')}
          </button>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            {t('settings.installUnavailable')}
          </p>
        )}
      </section>
      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">{t('settings.accountTitle')}</h2>
        <button
          type="button"
          onClick={logout}
          className="mt-3 min-h-11 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
        >
          {t('app.logout')}
        </button>
      </section>
    </main>
  )
}

export default Settings
