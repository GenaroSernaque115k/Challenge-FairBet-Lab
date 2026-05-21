import { useEffect, useState } from 'react'
import { betting, type Bet } from '../../services/betting'

export default function ActiveBets() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    betting.misApuestas(filter ? { status: filter } : undefined)
      .then(setBets)
      .finally(() => setLoading(false))
  }, [filter])

  const statusColors: Record<string, string> = {
    accepted: 'text-yellow-400 bg-yellow-400/10',
    won: 'text-green-400 bg-green-400/10',
    lost: 'text-red-400 bg-red-400/10',
    cashed_out: 'text-blue-400 bg-blue-400/10',
    cancelled: 'text-gray-400 bg-gray-400/10',
  }

  const statusLabel: Record<string, string> = {
    accepted: 'Activa',
    won: 'Ganada',
    lost: 'Perdida',
    cashed_out: 'Cash-out',
    cancelled: 'Cancelada',
  }

  return (
    <div>
      <div className="flex gap-1 mb-4 flex-wrap">
        {['', 'accepted', 'won', 'lost', 'cashed_out'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition ${
              filter === f
                ? 'bg-primary-500 text-black'
                : 'bg-black border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {f === '' ? 'Todas' : f === 'accepted' ? 'Activas' : f === 'won' ? 'Gan.' : f === 'lost' ? 'Perd.' : 'C-out'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs text-gray-500 text-center py-8">Cargando...</p>
      ) : bets.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-8">No tienes apuestas</p>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {bets.map((bet) => (
            <div key={bet.id} className="bg-black border border-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-gray-500">
                  #{bet.id} - {new Date(bet.placed_at).toLocaleDateString()}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColors[bet.status] || 'text-gray-400 bg-gray-400/10'}`}>
                  {statusLabel[bet.status] || bet.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Stake: <span className="text-white font-semibold">{parseFloat(bet.stake).toFixed(2)}</span>
                </span>
                <span className="text-primary-400 font-semibold">x{parseFloat(bet.total_odds).toFixed(2)}</span>
              </div>
              {bet.payout && (
                <div className="mt-1 text-xs">
                  <span className={`font-semibold ${bet.status === 'won' ? 'text-green-400' : bet.status === 'cashed_out' ? 'text-blue-400' : 'text-red-400'}`}>
                    Payout: {parseFloat(bet.payout).toFixed(2)} BP
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
