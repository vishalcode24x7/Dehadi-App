import { useLanguage } from '../../../hooks/useLanguage'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useSummary } from '../../../hooks/useSummary'
import { formatCurrency } from '../../../utils/formatCurrency'

function ContractorDashboard() {
  const { t } = useLanguage()
  const {
    todayPresent,
    todayKhoraki,
    totalBalance,
    totalWorkers,
    loadDashboard,
  } = useSummary()

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])
  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <h1 className="text-xl font-bold">{t('dashboard.contractor')}</h1>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <article className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-sm text-slate-600">{t('summary.totalWorkers')}</p>
          <p className="mt-1 text-xl font-bold">{totalWorkers}</p>
        </article>
        <article className="rounded-lg border p-3">
          <p className="text-sm text-slate-600">{t('summary.todayPresent')}</p>
          <p className="mt-1 text-xl font-bold">{todayPresent}</p>
        </article>
        <article className="rounded-lg border p-3">
          <p className="text-sm text-slate-600">{t('summary.todayKhoraki')}</p>
          <p className="mt-1 text-lg font-bold">{formatCurrency(todayKhoraki)}</p>
        </article>
        <article className="col-span-2 rounded-lg border border-slate-300 bg-white p-3">
          <p className="text-sm text-slate-600">{t('summary.totalBalance')}</p>
          <p className="mt-1 text-xl font-bold">{formatCurrency(totalBalance)}</p>
        </article>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          to="/contractor/workers"
          className="flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-2 text-sm font-medium text-white"
        >
          {t('dashboard.workers')}
        </Link>
        <Link
          to="/contractor/attendance"
          className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium"
        >
          {t('attendance.title')}
        </Link>
        <Link
          to="/contractor/payments"
          className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium"
        >
          {t('payments.title')}
        </Link>
        <Link
          to="/contractor/khoraki"
          className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium"
        >
          {t('khoraki.title')}
        </Link>
      </div>
    </main>
  )
}

export default ContractorDashboard
