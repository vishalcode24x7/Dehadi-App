import { useEffect, useState } from 'react'
import { useKhorakiGroups } from '../../../hooks/useKhorakiGroups'
import { useLanguage } from '../../../hooks/useLanguage'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'

function getToday() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function createEntryDraft() {
  return { amount: '', date: getToday() }
}

function Khoraki() {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [workerIds, setWorkerIds] = useState([])
  const [entries, setEntries] = useState([createEntryDraft()])
  const [note, setNote] = useState('')
  const [addingEntryGroupId, setAddingEntryGroupId] = useState('')
  const [additionalEntry, setAdditionalEntry] = useState(createEntryDraft)
  const [divideDates, setDivideDates] = useState({})
  const [validationError, setValidationError] = useState('')
  const {
    groups,
    workers,
    loading,
    error,
    loadGroups,
    createGroup,
    addGroupEntry,
    divideGroup,
  } = useKhorakiGroups()
  const { t } = useLanguage()

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  const toggleWorker = (workerId) => {
    setWorkerIds((current) =>
      current.includes(workerId)
        ? current.filter((id) => id !== workerId)
        : [...current, workerId],
    )
  }

  const updateEntry = (index, key, value) => {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [key]: value } : entry,
      ),
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    setValidationError('')
    if (!name.trim()) {
      setValidationError(t('khoraki.groupNameRequired'))
      return
    }
    if (workerIds.length === 0) {
      setValidationError(t('khoraki.groupWorkersRequired'))
      return
    }
    const parsedEntries = entries.map((entry) => ({
      amount: Number(entry.amount),
      date: entry.date,
    }))
    if (
      parsedEntries.some(
        (entry) => !Number.isFinite(entry.amount) || entry.amount <= 0,
      )
    ) {
      setValidationError(t('khoraki.amountRequired'))
      return
    }
    if (parsedEntries.some((entry) => !entry.date)) {
      setValidationError(t('khoraki.dateRequired'))
      return
    }
    try {
      await createGroup({
        name: name.trim(),
        workerIds,
        entries: parsedEntries,
        note,
      })
      setName('')
      setWorkerIds([])
      setEntries([createEntryDraft()])
      setNote('')
      setShowForm(false)
    } catch {
      return
    }
  }

  const submitAdditionalEntry = async (event, groupId) => {
    event.preventDefault()
    setValidationError('')
    const numericAmount = Number(additionalEntry.amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setValidationError(t('khoraki.amountRequired'))
      return
    }
    if (!additionalEntry.date) {
      setValidationError(t('khoraki.dateRequired'))
      return
    }
    try {
      await addGroupEntry(groupId, {
        amount: numericAmount,
        date: additionalEntry.date,
      })
      setAdditionalEntry(createEntryDraft())
      setAddingEntryGroupId('')
    } catch {
      return
    }
  }

  const submitDivision = async (event, groupId) => {
    event.preventDefault()
    setValidationError('')
    const date = divideDates[groupId] || getToday()
    if (!date) {
      setValidationError(t('khoraki.dateRequired'))
      return
    }
    try {
      await divideGroup(groupId, date)
    } catch {
      return
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-20 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('khoraki.title')}</h1>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="min-h-11 rounded-lg bg-slate-900 px-3 text-xs font-medium text-white"
        >
          {t('khoraki.createGroup')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-4 space-y-3 rounded-xl border border-slate-200 bg-white p-3">
          <label className="block text-sm font-medium">
            {t('khoraki.groupName')}
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">
              {t('khoraki.groupWorkers')}
            </legend>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {workers.map((worker) => (
                <label
                  key={worker._id}
                  className="flex min-h-11 items-center gap-2.5 rounded-lg border px-3"
                >
                  <input
                    type="checkbox"
                    checked={workerIds.includes(worker._id)}
                    onChange={() => toggleWorker(worker._id)}
                    className="h-5 w-5"
                  />
                  <span>{worker.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium">
              {t('khoraki.dateEntries')}
            </legend>
            {entries.map((entry, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border border-slate-200 p-3"
              >
                <label className="block text-sm font-medium">
                  {t('khoraki.amount')}
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    value={entry.amount}
                    onChange={(event) =>
                      updateEntry(index, 'amount', event.target.value)
                    }
                    required
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
                  />
                </label>
                <label className="block text-sm font-medium">
                  {t('khoraki.date')}
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(event) =>
                      updateEntry(index, 'date', event.target.value)
                    }
                    required
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3"
                  />
                </label>
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setEntries((current) =>
                        current.filter((_, entryIndex) => entryIndex !== index),
                      )
                    }
                    className="min-h-11 rounded-lg border border-red-300 px-3 text-xs text-red-700"
                  >
                    {t('khoraki.removeEntry')}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setEntries((current) => [...current, createEntryDraft()])}
              className="min-h-11 w-full rounded-lg border border-slate-400 px-3 text-xs"
            >
              {t('khoraki.addDateEntry')}
            </button>
          </fieldset>

          <label className="block text-sm font-medium">
            {t('khoraki.note')}
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
              {validationError ||
                (error.startsWith('khoraki.') ? t(error) : error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-slate-900 text-sm font-medium text-white disabled:opacity-60"
          >
            {t('khoraki.saveGroup')}
          </button>
        </form>
      )}

      {loading && <p>{t('auth.loading')}</p>}
      {error && !showForm && (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {error.startsWith('khoraki.') ? t(error) : error}
        </p>
      )}
      {!loading && groups.length === 0 && (
        <p className="rounded-lg border bg-white p-3 text-center text-sm">
          {t('khoraki.emptyGroups')}
        </p>
      )}

      <div className="space-y-2">
        {groups.map((group) => {
          const groupEntries = group.entries?.length
            ? group.entries
            : [{ amount: group.amount, date: group.date }]
          return (
            <article key={group._id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold">{group.name}</h2>
                  <p className="text-base font-bold">
                    {formatCurrency(group.amount)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {group.workerIds.length} {t('khoraki.workers')}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {groupEntries.map((entry, index) => (
                      <li key={`${entry.date}-${index}`} className="text-xs">
                        {formatDate(entry.date)} · {formatCurrency(entry.amount)}
                      </li>
                    ))}
                  </ul>
                  {group.dividedDate && (
                    <p className="mt-2 text-sm text-slate-600">
                      {t('khoraki.dividedDate')}: {formatDate(group.dividedDate)}
                    </p>
                  )}
                  {group.note && (
                    <p className="mt-1 break-words text-sm">{group.note}</p>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase">
                  {t(`khoraki.status.${group.status}`)}
                </span>
              </div>
              {group.status === 'active' && (
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError('')
                      setAddingEntryGroupId((current) =>
                        current === group._id ? '' : group._id,
                      )
                    }}
                    className="min-h-11 w-full rounded-lg border border-slate-400 px-3 text-xs"
                  >
                    {t('khoraki.addDateEntry')}
                  </button>
                  {addingEntryGroupId === group._id && (
                    <form
                      onSubmit={(event) =>
                        submitAdditionalEntry(event, group._id)
                      }
                      className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <label className="block text-sm font-medium">
                        {t('khoraki.amount')}
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0.01"
                          step="0.01"
                          value={additionalEntry.amount}
                          onChange={(event) =>
                            setAdditionalEntry((current) => ({
                              ...current,
                              amount: event.target.value,
                            }))
                          }
                          required
                          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"
                        />
                      </label>
                      <label className="block text-sm font-medium">
                        {t('khoraki.date')}
                        <input
                          type="date"
                          value={additionalEntry.date}
                          onChange={(event) =>
                            setAdditionalEntry((current) => ({
                              ...current,
                              date: event.target.value,
                            }))
                          }
                          required
                          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"
                        />
                      </label>
                      {validationError && (
                        <p className="text-sm text-red-700" role="alert">
                          {validationError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="min-h-11 w-full rounded-lg bg-slate-900 px-4 text-xs font-medium text-white disabled:opacity-60"
                      >
                        {t('khoraki.saveEntry')}
                      </button>
                    </form>
                  )}
                  <form
                    onSubmit={(event) => submitDivision(event, group._id)}
                    className="space-y-3"
                  >
                    <label className="block text-sm font-medium">
                      {t('khoraki.divideDate')}
                      <input
                        type="date"
                        value={divideDates[group._id] || getToday()}
                        onChange={(event) =>
                          setDivideDates((current) => ({
                            ...current,
                            [group._id]: event.target.value,
                          }))
                        }
                        required
                        className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"
                      />
                    </label>
                    {validationError && (
                      <p className="text-sm text-red-700" role="alert">
                        {validationError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="min-h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {t('khoraki.divideNow')}
                    </button>
                  </form>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}

export default Khoraki
