import api from './api'

export interface Bonus {
  id: number
  tipo: 'bienvenida' | 'recarga'
  nombre: string
  descripcion: string
  porcentaje: string
  monto_max: string
  rollover_requerido: number
  activo: boolean
}

export interface UserBonus {
  id: number
  bonus: Bonus
  saldo_bono: string
  rollover_completado: string
  rollover_restante: string
  rollover_porcentaje: number
  rollover_completo: boolean
  fecha_otorgado: string
  fecha_expiracion: string | null
  activo: boolean
}

export const bonuses = {
  getAvailable: async (): Promise<Bonus[]> => {
    const response = await api.get('/bonuses/available/')
    return response.data
  },

  apply: async (bonusId: number, depositAmount?: string): Promise<{ mensaje: string }> => {
    const response = await api.post('/bonuses/apply/', {
      bonus_id: bonusId,
      ...(depositAmount ? { deposit_amount: depositAmount } : {}),
    })
    return response.data
  },

  getMyBonuses: async (): Promise<UserBonus[]> => {
    const response = await api.get('/bonuses/my-bonus/')
    return response.data
  },
}
