import { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import ConfirmModal from './ConfirmModal'

function getToday() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function MoneyEntryPage({
  namespace,
  workers,
  items,
  loading,
  error,
  toast,
  clearToast,
  loadEntries,
  createEntry,
  deleteEntry,
}) {
  const [workerId, setWorkerId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getToday)
  const [note, setNote] = useState('')
  const [validationError, setValidationError] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    loadEntries(workerId)
  }, [workerId, loadEntries])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(clearToast, 2500)
    return () => window.clearTimeout(timeout)
  }, [toast, clearToast])

  const submit = async (event) => {
    event.preventDefault()
    setValidationError('')
    const numericAmount = Number(amount)
    if (!workerId) {
      setValidationError(t(`${namespace}.workerRequired`))
      return
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setValidationError(t(`${namespace}.amountRequired`))
      return
    }
    if (note.length > 200) {
      setValidationError(t(`${namespace}.noteMax`))
      return
    }
    await createEntry({
      workerId,
      amount: numericAmount,
      date,
      note,
    }).catch(() => {})
    setAmount('')
    setDate(getToday())
    setNote('')
  }

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <h1 className="mb-3 text-xl font-bold">{t(`${namespace}.title`)}</h1>

      {toast && (
        <div role="status" className="mb-3 rounded-lg border border-green-300 bg-green-50 px-3 py-2.5 text-sm">
          {t(toast)}
        </div>
      )}

      <form onSubmit={submit} className="mb-4 space-y-3 rounded-xl border border-slate-200 bg-white p-3">
        <label className="block text-sm font-medium">
          {t(`${namespace}.worker`)}
          <select
            value={workerId}
            onChange={(event) => setWorkerId(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
          >
            <option value="">{t(`${namespace}.selectWorker`)}</option>
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium">
          {t(`${namespace}.date`)}
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
          />
        </label>

        <label className="block text-sm font-medium">
          {t(`${namespace}.amount`)}
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
          />
        </label>

        <label className="block text-sm font-medium">
          {t(`${namespace}.note`)}
          <input
            type="text"
            maxLength={200}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
          />
        </label>

        {(validationError || error) && (
          <p className="text-sm text-red-700" role="alert">
            {validationError || (error.startsWith(namespace) ? t(error) : error)}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          {t(`${namespace}.save`)}
        </button>
      </form>

      {loading && <p>{t('auth.loading')}</p>}
      {!loading && workerId && items.length === 0 && (
        <p className="rounded-lg border bg-white p-3 text-center text-sm">{t(`${namespace}.empty`)}</p>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-bold">{formatCurrency(item.amount)}</p>
                <p className="text-sm text-slate-600">{formatDate(item.date)}</p>
                {item.note && (
                  <p className="mt-1 break-words text-sm">{item.note}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDeleteId(item._id)}
                className="min-h-11 shrink-0 rounded-lg border border-red-300 px-2.5 text-xs text-red-700"
              >
                {t(`${namespace}.delete`)}
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title={t(`${namespace}.confirmDelete`)}
        confirmLabel={t(`${namespace}.delete`)}
        cancelLabel={t(`${namespace}.cancel`)}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await deleteEntry(deleteId).catch(() => {})
          setDeleteId(null)
        }}
      />
    </main>
  )
}

export default MoneyEntryPage
