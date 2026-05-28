import api from './api'
import type { AuthTokens, User, TransactionRequest, WalletBalance } from '../types'

export const auth = {
  register: async (data: { username: string; email: string; password: string; dni: string; fecha_nacimiento: string }): Promise<AuthTokens> => {
    const response = await api.post('/auth/register/', data)
    return response.data
  },

  login: async (username: string, password: string): Promise<AuthTokens> => {
    const response = await api.post('/auth/login/', { username, password })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me/')
    return response.data
  },
}

export const wallet = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await api.get('/wallet/saldo/')
    return response.data
  },

  getBonusBalance: async (): Promise<WalletBalance> => {
    const response = await api.get('/wallet/saldo/?tipo=bonus')
    return response.data
  },

  recargar: async (data: TransactionRequest): Promise<WalletBalance> => {
    const response = await api.post('/wallet/recargar/', data)
    return response.data
  },

  retirar: async (data: TransactionRequest): Promise<WalletBalance> => {
    const response = await api.post('/wallet/retirar/', data)
    return response.data
  },
}
