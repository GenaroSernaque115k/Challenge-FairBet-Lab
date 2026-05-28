import { useState } from 'react'
import { operator, type ExposureItem } from '../../services/operator'

export default function ExposureChart() {
  const [eventId, setEventId] = useState('')
  const [exposure, setExposure] = useState<ExposureItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!eventId) return
    setError('')
    setLoading(true)
    try {
      const result = await operator.getExposure(Number(eventId))
      setExposure(result)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar exposure')
      setExposure([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="number"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="ID del evento..."
          className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"
        >
          {loading ? '...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-3 py-2 rounded-lg text-xs">{error}</div>
      )}

      {exposure.length > 0 && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_120px] gap-2 px-4 py-2 text-[10px] text-gray-500 font-semibold border-b border-gray-800">
            <span>Seleccion</span>
            <span className="text-center">Odds</span>
            <span className="text-center">Apuestas</span>
            <span className="text-center">Payout Potencial</span>
          </div>
          {exposure.map((item) => (
            <div key={item.selection_id} className="grid grid-cols-[1fr_100px_100px_120px] gap-2 px-4 py-2.5 items-center text-xs border-b border-gray-800/30 last:border-0">
              <span className="text-gray-300">{item.selection_name}</span>
              <span className="text-center text-primary-400">{parseFloat(item.odds).toFixed(2)}</span>
              <span className="text-center text-gray-400">{item.bets_count}</span>
              <span className="text-center text-red-400 font-semibold">{parseFloat(item.potential_payout).toFixed(2)} BP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
