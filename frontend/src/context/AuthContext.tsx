import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { auth } from '../services/auth'
import type { User } from '../types'
import { useBalanceStore } from '../store/balanceStore'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: { username: string; email: string; password: string; dni: string; fecha_nacimiento: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      auth.getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('access_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const data = await auth.login(username, password)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    setUser(data.user)
  }

  const register = async (data: { username: string; email: string; password: string; dni: string; fecha_nacimiento: string }) => {
    useBalanceStore.getState().setBalance(0)
    useBalanceStore.getState().setBonusBalance(0)
    const result = await auth.register(data)
    localStorage.setItem('access_token', result.access)
    localStorage.setItem('refresh_token', result.refresh)
    setUser(result.user)
  }

  const logout = () => {
    auth.logout()
    useBalanceStore.getState().setBalance(0)
    useBalanceStore.getState().setBonusBalance(0)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
