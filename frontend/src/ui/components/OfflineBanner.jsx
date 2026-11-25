import { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { t } = useLanguage()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-100 px-3 py-2 text-center text-sm font-semibold text-amber-950"
    >
      {t('pwa.offline')}
    </div>
  )
}

export default OfflineBanner
