import api from './api'

export interface DepositLimits {
  limite_diario: string
  limite_semanal: string
  limite_mensual: string
  limite_apuesta_max: string
  limite_perdida_diaria: string
}

export const responsibleGaming = {
  getLimits: async (): Promise<DepositLimits> => {
    const response = await api.get('/responsible-gaming/limits/')
    return response.data
  },

  setLimits: async (data: Partial<DepositLimits>): Promise<DepositLimits> => {
    const response = await api.post('/responsible-gaming/limits/', data)
    return response.data
  },

  autoExclude: async (periodo: string, motivo?: string): Promise<{ mensaje: string }> => {
    const response = await api.post('/responsible-gaming/auto-exclude/', { periodo, motivo })
    return response.data
  },
}
