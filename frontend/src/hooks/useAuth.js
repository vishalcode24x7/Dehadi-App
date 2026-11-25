import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth.api'
import { useAuthStore } from '../state/auth.store'

export function useAuth() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession()
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [clearSession, navigate])

  const saveSession = (result) => {
    setSession(result.token, result.user)
  }

  const loginPin = async (input, expectedRole) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.loginPin(input)
      if (expectedRole && data.user.role !== expectedRole) {
        setError('auth.roleMismatch')
        throw new Error('auth.roleMismatch')
      }
      saveSession(data)
      navigate(data.user.role === 'contractor' ? '/contractor' : '/worker', {
        replace: true,
      })
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'auth.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const register = async (input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.register(input)
      saveSession(data)
      navigate('/contractor', { replace: true })
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'auth.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    error,
    loginPin,
    register,
    logout,
  }
}
