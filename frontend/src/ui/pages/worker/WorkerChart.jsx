import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWorkerSummary } from '../../../hooks/useWorkerSummary'
import { useLanguage } from '../../../hooks/useLanguage'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import WorkerBottomNav from '../../layouts/WorkerBottomNav'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getInitialMonth(searchParams) {
  const month = searchParams.get('month')
  return month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)
    ? month
    : getCurrentMonth()
}

function createDailyRows(summary) {
  const rows = new Map()
  for (const item of summary?.attendance || []) {
    rows.set(item.date, { date: item.date, status: item.status, paid: 0 })
  }
  for (const item of summary?.payments || []) {
    const row = rows.get(item.date) || {
      date: item.date,
      status: '',
      paid: 0,
    }
    row.paid += Number(item.amount)
    rows.set(item.date, row)
  }
  return [...rows.values()].sort((first, second) =>
    first.date.localeCompare(second.date),
  )
}

function WorkerChart() {
  const [searchParams] = useSearchParams()
  const [month, setMonth] = useState(() => getInitialMonth(searchParams))
  const { summary, loading, error, loadSummary } = useWorkerSummary()
  const { t } = useLanguage()

  useEffect(() => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return
    const from = `${month}-01`
    const lastDay = new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(5, 7)),
      0,
    ).getDate()
    loadSummary(from, `${month}-${String(lastDay).padStart(2, '0')}`)
  }, [month, loadSummary])

  const dailyRows = createDailyRows(summary)
  const statusStyles = {
    present: 'bg-emerald-100 text-emerald-800',
    half: 'bg-amber-100 text-amber-800',
    oneAndHalf: 'bg-sky-100 text-sky-800',
    double: 'bg-violet-100 text-violet-800',
    absent: 'bg-rose-100 text-rose-800',
  }

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-24 pt-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-100 text-sky-700">
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
        </span>
        <h1 className="text-xl font-bold">{t('workerChart.title')}</h1>
      </div>
      <label className="mb-4 block text-sm font-medium">
        {t('workerSummary.month')}
        <input
          type="month"
          value={month}
          onChange={(event) => {
            if (/^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value)) {
              setMonth(event.target.value)
            }
          }}
          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"
        />
      </label>

      {loading && <p className="mb-3 text-sm">{t('auth.loading')}</p>}
      {error && (
        <p className="mb-3 text-sm text-red-700" role="alert">
          {error.startsWith('summary.') ? t(error) : error}
        </p>
      )}

      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <article className="flex min-h-[76px] min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              {summary?.name?.trim()?.charAt(0)?.toUpperCase() || '—'}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                {t('workerChart.workerName')}
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {summary?.name || '—'}
              </p>
            </div>
          </article>
          <article className="flex min-h-[76px] min-w-0 flex-col justify-center rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 px-3 py-2.5 text-white shadow-sm shadow-sky-200">
            <p className="text-[10px] font-medium text-sky-100">
              {t('workerChart.totalDehadi')}
            </p>
            <p className="mt-1 truncate text-base font-bold">
              {summary?.days ?? 0} {t('workerChart.dayUnit')}
            </p>
          </article>
          <article className="col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-emerald-900">
                {t('workerChart.balanceAfterDeductions')}
              </p>
              <p className="shrink-0 text-lg font-bold text-emerald-800">
                {formatCurrency(summary?.balance ?? 0)}
              </p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-emerald-200 pt-2">
              <div>
                <p className="text-[9px] leading-tight text-emerald-800">
                  {t('summary.earned')}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {formatCurrency(summary?.earned ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[9px] leading-tight text-emerald-800">
                  {t('workerSummary.paid')}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {formatCurrency(summary?.paid ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[9px] leading-tight text-emerald-800">
                  {t('workerSummary.khoraki')}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                  {formatCurrency(summary?.khoraki ?? 0)}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
            <h2 className="text-xs font-semibold text-slate-800">
              {t('workerChart.dailyDetails')}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
              {dailyRows.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-[28%] px-2.5 py-2.5 font-semibold">
                    {t('workerChart.date')}
                  </th>
                  <th className="w-[36%] px-2 py-2.5 font-semibold">
                    {t('workerChart.attendance')}
                  </th>
                  <th className="w-[36%] px-2.5 py-2.5 text-right font-semibold">
                    {t('workerChart.priceTake')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyRows.map((row) => (
                  <tr key={row.date} className="transition-colors even:bg-slate-50/60">
                    <td className="whitespace-nowrap px-2.5 py-3 text-[11px] font-medium text-slate-700">
                      {formatDate(row.date)}
                    </td>
                    <td className="px-2 py-3">
                      {row.status ? (
                        <span
                          className={`inline-flex max-w-full items-center rounded-full px-2 py-1 text-[10px] font-semibold ${
                            statusStyles[row.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t(`attendance.option.${row.status}`)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-right font-semibold text-teal-700">
                      {row.paid > 0 ? formatCurrency(row.paid) : '—'}
                    </td>
                  </tr>
                ))}
                {!loading && dailyRows.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-3 py-8 text-center text-xs text-slate-500"
                    >
                      {t('workerChart.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
              {dailyRows.length > 0 && (
                <tfoot className="border-t border-slate-200 bg-slate-50">
                  <tr>
                    <td
                      colSpan={2}
                      className="px-2.5 py-2.5 text-xs font-semibold text-slate-600"
                    >
                      {t('workerChart.totalTaken')}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5 text-right text-xs font-bold text-teal-700">
                      {formatCurrency(summary?.paid ?? 0)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </section>
      <WorkerBottomNav />
    </main>
  )
}

export default WorkerChart
