import { useEffect, useState } from 'react'
import { useWorkerSummary } from '../../../hooks/useWorkerSummary'
import { useLanguage } from '../../../hooks/useLanguage'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import WorkerBottomNav from '../../layouts/WorkerBottomNav'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function WorkerKhoraki() {
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
    loadSummary(from, `${month}-${String(lastDay).padStart(2, '0')}`)
  }, [month, loadSummary])

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-24 pt-4">
      <h1 className="mb-4 text-xl font-bold">{t('workerNav.khoraki')}</h1>
      <label className="mb-4 block text-sm font-medium">
        {t('workerSummary.month')}
        <input type="month" value={month} onChange={(event) => setMonth(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3" />
      </label>
      {loading && <p>{t('auth.loading')}</p>}
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error.startsWith('summary.') ? t(error) : error}
        </p>
      )}
      <div className="mb-3 rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-sm text-slate-600">{t('workerSummary.khoraki')}</p>
        <p className="text-xl font-bold">{formatCurrency(summary?.khoraki ?? 0)}</p>
      </div>
      <div className="space-y-2">
        {!loading && summary?.khorakiEntries?.length === 0 && (
          <p className="rounded-lg border bg-white p-3 text-center text-sm">
            {t('workerSummary.emptyKhoraki')}
          </p>
        )}
        {summary?.khorakiEntries?.map((item) => (
          <article key={item._id} className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-base font-bold">{formatCurrency(item.amount)}</p>
            <p className="text-sm text-slate-600">{formatDate(item.date)}</p>
            {item.note && <p className="mt-1 break-words text-sm">{item.note}</p>}
          </article>
        ))}
      </div>
      <WorkerBottomNav />
    </main>
  )
}

export default WorkerKhoraki
