import { useEffect, useState } from 'react'
import { useAttendance } from '../../../hooks/useAttendance'
import { useLanguage } from '../../../hooks/useLanguage'

function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Attendance() {
  const [date, setDate] = useState(getToday)
  const [notes, setNotes] = useState({})
  const [savingWorkerId, setSavingWorkerId] = useState('')
  const {
    workers,
    attendanceByWorker,
    loading,
    error,
    loadAttendance,
    saveAttendance,
    toast,
    clearToast,
  } = useAttendance()
  const { t } = useLanguage()

  useEffect(() => {
    loadAttendance(date)
  }, [date, loadAttendance])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(clearToast, 2500)
    return () => window.clearTimeout(timeout)
  }, [toast, clearToast])

  const saveStatus = async (workerId, status) => {
    setSavingWorkerId(workerId)
    await saveAttendance({
      workerId,
      date,
      status,
      note: notes[workerId] || '',
    }).catch(() => {})
    setSavingWorkerId('')
  }

  const statuses = ['present', 'half', 'oneAndHalf', 'double', 'absent']

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <h1 className="mb-3 text-xl font-bold">{t('attendance.title')}</h1>

      <label className="mb-4 block text-sm font-medium">
        {t('attendance.date')}
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"
        />
      </label>

      {toast && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm"
        >
          {t(toast)}
        </div>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {error.startsWith('attendance.') ? t(error) : error}
        </p>
      )}

      {loading && workers.length === 0 && (
        <p>{t('auth.loading')}</p>
      )}

      {!loading && workers.length === 0 && (
        <p className="rounded-lg border bg-white p-3 text-center text-sm">
          {t('attendance.empty')}
        </p>
      )}

      <div className="space-y-2">
        {workers.map((worker) => {
          const selectedStatus = attendanceByWorker[worker._id]?.status
          const isSaving = savingWorkerId === worker._id

          return (
            <article key={worker._id} className="rounded-xl border border-slate-200 bg-white p-3">
              <h2 className="text-sm font-semibold">{worker.name}</h2>
              <p className="mb-2 text-xs text-slate-500">
                {t(`workers.${worker.workerType}`)}
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    aria-label={t(`attendance.${status}`)}
                    title={t(`attendance.${status}`)}
                    disabled={isSaving}
                    onClick={() => saveStatus(worker._id, status)}
                    className={`min-h-11 rounded-lg border px-1 text-xs font-semibold ${
                      selectedStatus === status
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300'
                    } disabled:opacity-60`}
                  >
                    {isSaving && selectedStatus === status
                      ? t('auth.loading')
                      : t(`attendance.option.${status}`)}
                  </button>
                ))}
              </div>

              <input
                type="text"
                maxLength={200}
                value={
                  notes[worker._id] ??
                  attendanceByWorker[worker._id]?.note ??
                  ''
                }
                onChange={(event) =>
                  setNotes((current) => ({
                    ...current,
                    [worker._id]: event.target.value,
                  }))
                }
                aria-label={t('attendance.note')}
                placeholder={t('attendance.note')}
                className="mt-2.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
              />
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default Attendance
