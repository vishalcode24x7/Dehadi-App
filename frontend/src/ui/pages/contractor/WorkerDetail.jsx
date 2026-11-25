import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSummary } from '../../../hooks/useSummary'
import { useLanguage } from '../../../hooks/useLanguage'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function WorkerDetail() {
  const { id } = useParams()
  const [month, setMonth] = useState(getCurrentMonth)
  const [detail, setDetail] = useState(null)
  const { loading, error, loadWorkerDetail } = useSummary()
  const { t } = useLanguage()

  useEffect(() => {
    const from = `${month}-01`
    const lastDay = new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(5, 7)),
      0,
    ).getDate()
    const to = `${month}-${String(lastDay).padStart(2, '0')}`
    loadWorkerDetail(id, from, to).then(setDetail)
  }, [id, month, loadWorkerDetail])

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <h1 className="mb-4 text-xl font-bold">
        {detail?.summary?.name || t('summary.attendance')}
      </h1>

      <label className="mb-4 block text-sm font-medium">
        {t('summary.month')}
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

      {detail?.summary && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <article className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-600">{t('summary.days')}</p>
            <p className="text-base font-bold">{detail.summary.days}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-600">{t('summary.earned')}</p>
            <p className="text-base font-bold">{formatCurrency(detail.summary.earned)}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-600">{t('summary.paid')}</p>
            <p className="text-base font-bold">{formatCurrency(detail.summary.paid)}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="text-sm text-slate-600">{t('summary.khoraki')}</p>
            <p className="text-base font-bold">{formatCurrency(detail.summary.khoraki)}</p>
          </article>
          <article className="col-span-2 rounded-lg border border-slate-300 bg-white p-3">
            <p className="text-sm text-slate-600">{t('summary.balance')}</p>
            <p className="text-xl font-bold">{formatCurrency(detail.summary.balance)}</p>
          </article>
        </div>
      )}

      {detail && (
        <div className="space-y-4">
          <section>
            <h2 className="mb-2 text-sm font-semibold">{t('summary.attendance')}</h2>
            {detail.attendance.length === 0 ? (
              <p className="rounded-lg border bg-white p-3 text-xs text-slate-600">
                {t('workerSummary.emptyAttendance')}
              </p>
            ) : (
              <div className="space-y-2">
                {detail.attendance.map((item) => (
                  <article key={item._id} className="rounded-lg border bg-white p-3 text-xs">
                    <span>{formatDate(item.date)}</span>
                    <span className="ml-2 font-semibold">{t(`attendance.${item.status}`)}</span>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold">{t('summary.payments')}</h2>
            {detail.payments.length === 0 ? (
              <p className="rounded-lg border bg-white p-3 text-xs text-slate-600">
                {t('workerSummary.emptyPayments')}
              </p>
            ) : (
              <div className="space-y-2">
                {detail.payments.map((item) => (
                  <article key={item._id} className="rounded-lg border bg-white p-3">
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-slate-600">{formatDate(item.date)}</p>
                    {item.note && <p className="text-sm break-words">{item.note}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold">{t('summary.khoraki')}</h2>
            {detail.khoraki.length === 0 ? (
              <p className="rounded-lg border bg-white p-3 text-xs text-slate-600">
                {t('workerSummary.emptyKhoraki')}
              </p>
            ) : (
              <div className="space-y-2">
                {detail.khoraki.map((item) => (
                  <article key={item._id} className="rounded-lg border bg-white p-3">
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-slate-600">{formatDate(item.date)}</p>
                    {item.note && <p className="text-sm break-words">{item.note}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default WorkerDetail
