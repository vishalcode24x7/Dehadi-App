import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'

function AppHeader() {
  const { t, toggleLanguage } = useLanguage()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-3 backdrop-blur">
      <button
        type="button"
        onClick={() => navigate(isAuthenticated ? '/contractor' : '/login')}
        aria-label={t('app.name')}
        className="flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg pr-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
      >
        <span
          aria-hidden="true"
          className="relative grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-sm shadow-teal-200"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
          >
            <path
              d="M6.5 5.75h9a2 2 0 0 1 2 2v10.5h-9a2 2 0 0 1-2-2V5.75Z"
              stroke="white"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 9.25h5M9.5 12.25h5M9.5 15.25h3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
        </span>
        <span className="bg-gradient-to-r from-teal-800 via-teal-700 to-orange-500 bg-clip-text text-[15px] font-extrabold tracking-tight text-transparent sm:text-base">
          {t('app.name')}
        </span>
      </button>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleLanguage}
          className="min-h-11 whitespace-nowrap rounded-lg border border-slate-300 px-2 text-xs font-semibold"
        >
          {`${t('language.hindi')} ⇄ ${t('language.english')}`}
        </button>
        {isAuthenticated && (
          <>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              aria-label={t('settings.title')}
              className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-300"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="m19.4 15 .1.1a1.8 1.8 0 1 1-2.55 2.55l-.1-.1a1.8 1.8 0 0 0-3.05 1.27v.28a1.8 1.8 0 1 1-3.6 0v-.15a1.8 1.8 0 0 0-3.07-1.27l-.1.1a1.8 1.8 0 1 1-2.55-2.55l.1-.1a1.8 1.8 0 0 0-1.27-3.05h-.28a1.8 1.8 0 1 1 0-3.6h.15a1.8 1.8 0 0 0 1.27-3.07l-.1-.1A1.8 1.8 0 1 1 6.9 2.63l.1.1a1.8 1.8 0 0 0 3.05-1.27v-.28a1.8 1.8 0 1 1 3.6 0v.15a1.8 1.8 0 0 0 3.07 1.27l.1-.1a1.8 1.8 0 1 1 2.55 2.55l-.1.1a1.8 1.8 0 0 0 1.27 3.05h.28a1.8 1.8 0 1 1 0 3.6h-.15A1.8 1.8 0 0 0 19.4 15Z"
                  transform="translate(1 1) scale(.92)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={logout}
              className="min-h-11 whitespace-nowrap rounded-lg border border-slate-300 px-2 text-xs"
            >
              {t('app.logout')}
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default AppHeader
