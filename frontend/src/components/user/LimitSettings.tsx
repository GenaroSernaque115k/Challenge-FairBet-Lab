import { useEffect, useState } from 'react'
import { responsibleGaming, type DepositLimits } from '../../services/responsible-gaming'

export default function LimitSettings() {
  const [limits, setLimits] = useState<DepositLimits | null>(null)
  const [form, setForm] = useState<Partial<DepositLimits>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    responsibleGaming.getLimits()
      .then(setLimits)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setError('')
    setMensaje('')
    setSaving(true)
    try {
      const result = await responsibleGaming.setLimits(form)
      setLimits(result)
      setForm({})
      setMensaje('Limites actualizados correctamente')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar limites')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500 text-sm py-8 text-center">Cargando limites...</p>

  const campos: { key: keyof DepositLimits; label: string; desc: string }[] = [
    { key: 'limite_diario', label: 'Limite Diario', desc: 'Maximo a depositar por dia' },
    { key: 'limite_semanal', label: 'Limite Semanal', desc: 'Maximo a depositar por semana' },
    { key: 'limite_mensual', label: 'Limite Mensual', desc: 'Maximo a depositar por mes' },
    { key: 'limite_apuesta_max', label: 'Limite Apuesta Max', desc: 'Maximo por apuesta individual' },
    { key: 'limite_perdida_diaria', label: 'Limite Perdida Diaria', desc: 'Maximo a perder por dia' },
  ]

  return (
    <div className="space-y-5">
      {mensaje && (
        <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2.5 rounded-lg text-sm">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2.5 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Limites Actuales</h3>
        <div className="grid grid-cols-2 gap-3">
          {campos.map(({ key, label }) => (
            <div key={key} className="bg-black rounded-lg px-3 py-2">
              <span className="text-[10px] text-gray-500 block">{label}</span>
              <span className="text-sm text-white font-semibold">
                {limits ? parseFloat(limits[key]).toFixed(2) : '0.00'} BP
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Modificar Limites</h3>
        <p className="text-xs text-gray-600 mb-4">
          Bajar limites es inmediato. Subir requiere 24h de espera.
        </p>
        <div className="space-y-4">
          {campos.map(({ key, label, desc }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={form[key] ?? (limits ? parseFloat(limits[key]).toString() : '0')}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  min="0"
                  step="0.0001"
                  className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
                <span className="text-xs text-gray-600 w-12 text-right">BP</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{desc}</p>
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-lg transition text-sm"
          >
            {saving ? 'Guardando...' : 'Guardar Limites'}
          </button>
        </div>
      </div>
    </div>
  )
}
