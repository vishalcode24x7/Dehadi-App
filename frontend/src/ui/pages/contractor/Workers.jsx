import { useEffect, useState } from 'react'
import { useWorkers } from '../../../hooks/useWorkers'
import { useLanguage } from '../../../hooks/useLanguage'
import PinInput from '../../components/PinInput'
import { Link } from 'react-router-dom'
import { useSummary } from '../../../hooks/useSummary'
import { formatCurrency } from '../../../utils/formatCurrency'

function Workers() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [resetPinId, setResetPinId] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [workerType, setWorkerType] = useState('mistri')
  const [dailyWage, setDailyWage] = useState('')
  const [validationError, setValidationError] = useState('')
  const {
    workers,
    loading,
    error,
    loadWorkers,
    createWorker,
    updateWorker,
    resetWorkerPin,
    deleteWorker,
  } = useWorkers()
  const { t } = useLanguage()
  const summary = useSummary()
  const loadSummaries = summary.loadSummaries
  const summariesByWorker = Object.fromEntries(
    summary.workers.map((item) => [item.workerId, item]),
  )

  useEffect(() => {
    loadWorkers()
    loadSummaries()
  }, [loadWorkers, loadSummaries])

  const clearForm = () => {
    setName('')
    setPhone('')
    setPin('')
    setWorkerType('mistri')
    setDailyWage('')
    setEditingId(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    setValidationError('')
    if (editingId) {
      if (!name.trim() || !/^\d{10}$/.test(phone) || !dailyWage) {
        setValidationError(t('workers.fieldsRequired'))
        return
      }
      await updateWorker(editingId, {
        name: name.trim(),
        phone,
        workerType,
        dailyWage: Number(dailyWage),
      }).catch(() => {})
    } else {
      if (
        !name.trim() ||
        !/^\d{10}$/.test(phone) ||
        !/^\d{6}$/.test(pin) ||
        !dailyWage
      ) {
        setValidationError(
          !/^\d{10}$/.test(phone)
            ? t('workers.phoneRequired')
            : !/^\d{6}$/.test(pin)
              ? t('workers.pinRequired')
              : t('workers.fieldsRequired'),
        )
        return
      }
      await createWorker({
        name: name.trim(),
        phone,
        pin,
        workerType,
        dailyWage: Number(dailyWage),
      }).catch(() => {})
    }
    clearForm()
    setShowForm(false)
  }

  const startEdit = (worker) => {
    setEditingId(worker._id)
    setName(worker.name)
    setPhone(worker.phone)
    setPin('')
    setWorkerType(worker.workerType)
    setDailyWage(String(worker.dailyWage))
    setShowForm(true)
  }

  const submitPinReset = async (event) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(pin)) {
      setValidationError(t('workers.pinRequired'))
      return
    }
    await resetWorkerPin(resetPinId, pin).catch(() => {})
    setPin('')
    setResetPinId(null)
  }

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('workers.title')}</h1>
        <button
          type="button"
          onClick={() => {
            clearForm()
            setShowForm((current) => !current)
          }}
          className="min-h-11 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white"
        >
          {t('workers.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-4 space-y-3 rounded-xl border border-slate-200 bg-white p-3">
          <label className="block text-sm font-medium">
            {t('workers.name')}
            <input value={name} onChange={(event) => setName(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border px-3" />
          </label>
          <label className="block text-sm font-medium">
            {t('workers.phone')}
            <input type="tel" inputMode="numeric" maxLength={10}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
              className="mt-1.5 h-11 w-full rounded-lg border px-3" />
          </label>
          {!editingId && (
            <div>
              <span className="mb-2 block text-sm font-medium">{t('workers.pin')}</span>
              <PinInput value={pin} onChange={setPin} label={t('workers.pin')} />
            </div>
          )}
          <label className="block text-sm font-medium">
            {t('workers.workerType')}
            <select value={workerType} onChange={(event) => setWorkerType(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border px-3">
              <option value="mistri">{t('workers.mistri')}</option>
              <option value="labour">{t('workers.labour')}</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            {t('workers.dailyWage')}
            <input type="number" inputMode="numeric" min="1"
              value={dailyWage} onChange={(event) => setDailyWage(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border px-3" />
          </label>
          {(validationError || error) && (
            <p className="text-sm text-red-700" role="alert">
              {validationError || error}
            </p>
          )}
          <button type="submit" disabled={loading}
            className="min-h-11 w-full rounded-lg bg-slate-900 text-sm text-white">
            {t('workers.save')}
          </button>
        </form>
      )}

      {resetPinId && (
        <form onSubmit={submitPinReset} className="mb-4 space-y-3 rounded-xl border border-slate-200 bg-white p-3">
          <span className="block text-sm font-medium">{t('workers.resetPin')}</span>
          <PinInput value={pin} onChange={setPin} label={t('workers.pin')} />
          {(validationError || error) && (
            <p className="text-sm text-red-700" role="alert">
              {validationError || error}
            </p>
          )}
          <button type="submit" className="min-h-11 w-full rounded-lg bg-slate-900 text-sm text-white">
            {t('workers.save')}
          </button>
        </form>
      )}

      {loading && <p>{t('auth.loading')}</p>}
      {!loading && workers.length === 0 && (
        <p className="rounded-lg border bg-white p-3 text-center text-sm">{t('workers.empty')}</p>
      )}
      <div className="space-y-2">
        {workers.map((worker) => (
          <article key={worker._id} className="rounded-xl border border-slate-200 bg-white p-3">
            <h2 className="text-sm font-semibold">{worker.name}</h2>
            <p className="mt-0.5 text-xs text-slate-600">{worker.phone}</p>
            <p className="mt-0.5 text-xs text-slate-600">{t(`workers.${worker.workerType}`)} · {formatCurrency(worker.dailyWage)}</p>
            {summariesByWorker[worker._id] && (
              <p className="mt-1 text-xs font-semibold">
                {t('summary.balance')}: {formatCurrency(summariesByWorker[worker._id].balance)}
              </p>
            )}
            <Link
              to={`/contractor/workers/${worker._id}`}
              className="mt-2.5 flex min-h-11 items-center justify-center rounded-lg border border-slate-300 text-xs"
            >
              {t('workers.detail')}
            </Link>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => startEdit(worker)}
                className="min-h-11 rounded-lg border px-1.5 text-[11px]">
                {t('workers.edit')}
              </button>
              <button type="button" onClick={() => {
                setResetPinId(worker._id)
                setPin('')
              }} className="min-h-11 rounded-lg border px-1.5 text-[11px]">
                {t('workers.resetPin')}
              </button>
              <button type="button" onClick={() => deleteWorker(worker._id)}
                className="min-h-11 rounded-lg border border-red-300 px-1.5 text-[11px] text-red-700">
                {t('workers.delete')}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Workers
