import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkerSummary } from '../../../hooks/useWorkerSummary'
import { useLanguage } from '../../../hooks/useLanguage'
import { formatCurrency } from '../../../utils/formatCurrency'
import WorkerBottomNav from '../../layouts/WorkerBottomNav'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function WorkerDashboard() {
  const [month, setMonth] = useState(getCurrentMonth)
  const { summary, loading, error, loadSummary } = useWorkerSummary()
  const { t } = useLanguage()

  useEffect(() => {
    const from = `${month}-01`
    const lastDay = new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(5, 7)),
      0,
    ).getDate()
    const to = `${month}-${String(lastDay).padStart(2, '0')}`
    loadSummary(from, to)
  }, [month, loadSummary])

  const cards = [
    [t('workerSummary.days'), summary?.days ?? 0],
    [t('workerSummary.earned'), formatCurrency(summary?.earned ?? 0)],
    [t('workerSummary.paid'), formatCurrency(summary?.paid ?? 0)],
    [t('workerSummary.khoraki'), formatCurrency(summary?.khoraki ?? 0)],
  ]

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-24 pt-4">
      <h1 className="mb-4 text-xl font-bold">{t('dashboard.worker')}</h1>
      <label className="mb-4 block text-sm font-medium">
        {t('workerSummary.month')}
        <input
          type="month"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"
        />
      </label>
      {loading && <p>{t('auth.loading')}</p>}
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error.startsWith('summary.') ? t(error) : error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-sm leading-snug text-slate-600">{label}</p>
            <p className="mt-1 break-words text-xl font-bold">{value}</p>
          </article>
        ))}
        <article className="col-span-2 rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-sm font-semibold">{t('workerSummary.balance')}</p>
          <p className="mt-1 break-words text-2xl font-bold">
            {formatCurrency(summary?.balance ?? 0)}
          </p>
        </article>
      </div>
      <Link
        to={`/worker/chart?month=${month}`}
        className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-4 text-sm font-semibold text-white shadow-sm shadow-teal-200"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
        >
          <path
            d="M4.75 19.25V12m4.75 7.25V5m4.75 14.25V9m4.75 10.25V3.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {t('workerChart.showChart')}
      </Link>
      <WorkerBottomNav />
    </main>
  )
}

export default WorkerDashboard
