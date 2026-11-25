import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import PinInput from '../../components/PinInput'

function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [validationError, setValidationError] = useState('')
  const { register, loading, error } = useAuth()
  const { t } = useLanguage()

  const submit = async (event) => {
    event.preventDefault()
    setValidationError('')
    if (!name.trim()) {
      setValidationError(t('auth.nameRequired'))
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      setValidationError(t('auth.phoneRequired'))
      return
    }
    if (!/^\d{6}$/.test(pin)) {
      setValidationError(t('auth.pinRequired'))
      return
    }
    await register({ name: name.trim(), phone, pin }).catch(() => {})
  }

  return (
    <main className="mx-auto w-full max-w-sm px-3 py-6">
      <h1 className="mb-4 text-xl font-bold">{t('auth.registerTitle')}</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium">
          {t('auth.name')}
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-base"
          />
        </label>
        <label className="block text-sm font-medium">
          {t('auth.phone')}
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
            className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-base"
          />
        </label>
        <div>
          <span className="mb-2 block text-sm font-medium">{t('auth.pin')}</span>
          <PinInput value={pin} onChange={setPin} label={t('auth.pinLabel')} />
        </div>
        {(validationError || error) && (
          <p className="text-sm text-red-700" role="alert">
            {validationError || error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? t('auth.loading') : t('auth.registerButton')}
        </button>
      </form>
      <Link
        to="/login"
        className="mt-4 flex min-h-11 items-center justify-center text-center text-sm font-medium text-slate-700"
      >
        {t('auth.loginLink')}
      </Link>
    </main>
  )
}

export default Register
