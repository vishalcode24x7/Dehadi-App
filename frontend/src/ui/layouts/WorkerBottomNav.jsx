import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

function WorkerBottomNav() {
  const { t } = useLanguage()
  const items = [
    { to: '/worker', label: t('workerNav.home'), end: true },
    { to: '/worker/attendance', label: t('workerNav.attendance') },
    { to: '/worker/paise', label: t('workerNav.paise') },
    { to: '/worker/khoraki', label: t('workerNav.khoraki') },
    { to: '/worker/chart', label: t('workerNav.chart') },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-h-14 items-center justify-center border-t-2 px-1 text-center text-[11px] font-semibold leading-tight ${
                isActive
                  ? 'border-slate-900 text-slate-950'
                  : 'border-transparent text-slate-500'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default WorkerBottomNav
