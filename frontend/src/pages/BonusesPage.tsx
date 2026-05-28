import { useEffect, useState } from 'react'
import { bonuses, type Bonus, type UserBonus } from '../services/bonuses'
import BonusCard from '../components/bonuses/BonusCard'
import RolloverProgress from '../components/bonuses/RolloverProgress'

export default function BonusesPage() {
  const [available, setAvailable] = useState<Bonus[]>([])
  const [myBonuses, setMyBonuses] = useState<UserBonus[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([bonuses.getAvailable(), bonuses.getMyBonuses()])
      .then(([av, my]) => {
        setAvailable(av)
        setMyBonuses(my)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleClaim = async (bonusId: number) => {
    setError('')
    setMensaje('')
    setClaiming(bonusId)
    try {
      const result = await bonuses.apply(bonusId)
      setMensaje(result.mensaje)
      load()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al reclamar bono')
    } finally {
      setClaiming(null)
    }
  }

  const claimedIds = new Set(myBonuses.map((ub) => ub.bonus.id))

  if (loading) return <div className="text-gray-500 text-center py-20">Cargando bonos...</div>

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-xl font-bold mb-6">Bonos</h1>

      {mensaje && (
        <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-2.5 rounded-lg text-sm mb-4">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2.5 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {myBonuses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Mis Bonos Activos</h2>
          <div className="space-y-4">
            {myBonuses.filter(ub => ub.activo).map((ub) => (
              <div key={ub.id} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{ub.bonus.nombre}</h3>
                    <p className="text-xs text-gray-500">Saldo: <span className="text-primary-400 font-bold">{parseFloat(ub.saldo_bono).toFixed(2)} BP</span></p>
                  </div>
                  {ub.rollover_completo && (
                    <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                      Rollover Completo
                    </span>
                  )}
                </div>
                <RolloverProgress
                  porcentaje={ub.rollover_porcentaje}
                  completado={ub.rollover_completado}
                  restante={ub.rollover_restante}
                  completo={ub.rollover_completo}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Bonos Disponibles</h2>
      {available.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay bonos disponibles</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {available.map((b) => (
            <BonusCard
              key={b.id}
              bonus={b}
              onClaim={handleClaim}
              disabled={claiming === b.id}
              claimed={claimedIds.has(b.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
