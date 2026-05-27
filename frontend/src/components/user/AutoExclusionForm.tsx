import { useState } from 'react'
import { responsibleGaming } from '../../services/responsible-gaming'
import { useAuth } from '../../context/AuthContext'

export default function AutoExclusionForm() {
  const { user } = useAuth()
  const [periodo, setPeriodo] = useState('')
  const [motivo, setMotivo] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!periodo) return
    setError('')
    setMensaje('')
    setLoading(true)
    try {
      const result = await responsibleGaming.autoExclude(periodo, motivo)
      setMensaje(result.mensaje)
      setPeriodo('')
      setMotivo('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al aplicar autoexclusion')
    } finally {
      setLoading(false)
    }
  }

  const isAutoexcluded = user?.estado_cuenta === 'autoexcluido'

  if (isAutoexcluded) {
    return (
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-yellow-500 text-xl">!</span>
        </div>
        <h3 className="text-sm font-semibold text-yellow-500 mb-2">Cuenta Autoexcluida</h3>
        <p className="text-xs text-gray-500">
          Tu cuenta esta actualmente autoexcluida. No puedes realizar apuestas hasta que termine el periodo.
        </p>
      </div>
    )
  }

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
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Autoexclusion</h3>
        <p className="text-xs text-gray-600 mb-5">
          Al autoexcluirte no podras realizar apuestas durante el periodo seleccionado.
          Esta accion no se puede deshacer hasta que termine el plazo.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2">Periodo de Autoexclusion</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: '7d', label: '7 Dias' },
                { value: '30d', label: '30 Dias' },
                { value: '90d', label: '90 Dias' },
                { value: 'indefinida', label: 'Indefinida' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriodo(opt.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition border ${
                    periodo === opt.value
                      ? 'bg-primary-500 text-black border-primary-500'
                      : 'bg-black border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Motivo (opcional)</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={2}
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none"
              placeholder="Necesito un descanso..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !periodo}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition text-sm"
          >
            {loading ? 'Procesando...' : 'Autoexcluirme'}
          </button>

          <p className="text-[10px] text-gray-600 text-center">
            El juego responsable es parte de nuestra politica.
          </p>
        </div>
      </div>
    </div>
  )
}
