import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import PinInput from '../../components/PinInput'

function Login() {
  const [role, setRole] = useState('contractor')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [validationError, setValidationError] = useState('')
  const { loginPin, loading, error } = useAuth()
  const { t } = useLanguage()

  const submit = async (event) => {
    event.preventDefault()
    setValidationError('')

    if (!/^\d{10}$/.test(phone)) {
      setValidationError(t('auth.phoneRequired'))
      return
    }

    if (!/^\d{6}$/.test(pin)) {
      setValidationError(t('auth.pinRequired'))
      return
    }
    await loginPin({ phone, pin }, role).catch(() => {})
  }

  return (
    <main className="mx-auto w-full max-w-sm px-3 py-6">
      <h1 className="mb-4 text-xl font-bold">{t('auth.title')}</h1>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole('contractor')}
          className={`min-h-11 rounded-lg border px-3 text-sm ${role === 'contractor' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'}`}
        >
          {t('auth.owner')}
        </button>
        <button
          type="button"
          onClick={() => setRole('worker')}
          className={`min-h-11 rounded-lg border px-3 text-sm ${role === 'worker' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'}`}
        >
          {t('auth.worker')}
        </button>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
          <PinInput
            value={pin}
            onChange={setPin}
            label={t('auth.pinLabel')}
          />
        </div>

        {(validationError || error) && (
          <p className="text-sm text-red-700" role="alert">
            {validationError || (error.startsWith('auth.') ? t(error) : error)}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? t('auth.loading') : t('auth.loginButton')}
        </button>
      </form>

      {role === 'contractor' && (
        <Link
          to="/register"
          className="mt-4 flex min-h-11 items-center justify-center text-center text-sm font-medium text-slate-700"
        >
          {t('auth.registerLink')}
        </Link>
      )}
    </main>
  )
}

export default Login
