import { useState } from 'react'
import { X } from 'lucide-react'
import { betting } from '../../services/betting'
import { useBalanceStore } from '../../store/balanceStore'
import { wallet as walletService } from '../../services/auth'

interface BetSelection {
  selectionId: number
  odds: string
  name: string
  eventHome: string
  eventAway: string
}

interface BetSlipProps {
  selections: BetSelection[]
  onRemove: (id: number) => void
  onClear: () => void
  onBetPlaced: () => void
}

type TabType = 'simple' | 'combinada' | 'sistema'
type SistemaType = 'trixie' | 'yankee' | 'patent' | 'lucky15'

const SISTEMA_OPTIONS: { value: SistemaType; label: string }[] = [
  { value: 'trixie', label: 'Trixie (4)' },
  { value: 'yankee', label: 'Yankee (11)' },
  { value: 'patent', label: 'Patent (7)' },
  { value: 'lucky15', label: 'Lucky 15 (15)' },
]

export default function BetSlip({ selections, onRemove, onClear, onBetPlaced }: BetSlipProps) {
  const [tab, setTab] = useState<TabType>('simple')
  const [sistemaType, setSistemaType] = useState<SistemaType>('trixie')
  const [stake, setStake] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setBalance } = useBalanceStore()

  const totalOdds = selections.reduce((acc, s) => acc * parseFloat(s.odds), 1)

  const handleBet = async () => {
    setError('')
    setLoading(true)
    try {
      const idempotencyKey = crypto.randomUUID()
      const selData = selections.map((s) => ({ selection_id: s.selectionId }))
      const expectedOdds = Object.fromEntries(selections.map((s) => [String(s.selectionId), s.odds]))

      if (tab === 'sistema') {
        await betting.apostar({
          selections: selData, stake, idempotency_key: idempotencyKey,
          sistema_tipo: sistemaType, expected_odds: expectedOdds,
        })
      } else {
        await betting.apostar({
          selections: selData, stake, idempotency_key: idempotencyKey,
          expected_odds: expectedOdds,
        })
      }
      walletService.getBalance().then((d) => setBalance(parseFloat(d.balance)))
      onClear()
      setStake('')
      onBetPlaced()
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(`Re-cotización: ${err.response.data.error}`)
      } else {
        setError(err.response?.data?.error || 'Error al realizar apuesta')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex border-b border-gray-800 -mx-5 px-5 mb-4">
        {(['simple', 'combinada', 'sistema'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold uppercase transition border-b-2 -mb-[1px] ${
              tab === t ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'simple' ? 'Simple' : t === 'combinada' ? 'Combinada' : 'Sistema'}
          </button>
        ))}
      </div>

      {tab === 'sistema' && (
        <div className="mb-3">
          <select
            value={sistemaType}
            onChange={(e) => setSistemaType(e.target.value as SistemaType)}
            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
          >
            {SISTEMA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {selections.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-8">
          Selecciona cuotas para comenzar
        </p>
      ) : (
        <div className="space-y-3">
          {selections.map((sel) => (
            <div key={sel.selectionId} className="flex items-center justify-between bg-black rounded-lg p-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs truncate">{sel.eventHome} vs {sel.eventAway}</p>
                <p className="text-[11px] text-primary-400">{sel.name} @ {parseFloat(sel.odds).toFixed(2)}</p>
              </div>
              <button onClick={() => onRemove(sel.selectionId)} className="text-gray-600 hover:text-red-400 ml-2">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="border-t border-gray-800 pt-3 space-y-3">
            {tab === 'sistema' && (
              <div className="text-xs text-gray-500">
                Importe por linea: <span className="text-white">{stake || '0'} BP</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Cuota total</span>
              <span className="font-bold text-primary-400">{totalOdds.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Importe de apuesta</label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                min="1"
                step="1"
                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="0.00"
              />
            </div>
            <div className="flex gap-1.5">
              {[10, 50, 100].map((v) => (
                <button key={v} type="button" onClick={() => setStake(v.toString())}
                  className="flex-1 bg-black hover:bg-[#252525] border border-gray-700 py-1.5 rounded text-xs transition">
                  +{v}
                </button>
              ))}
              <button type="button" onClick={() => setStake('1000')}
                className="flex-1 bg-black hover:bg-[#252525] border border-gray-700 py-1.5 rounded text-xs transition">
                MAX
              </button>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">Ganancia posible</span>
              <span className="text-green-500">
                {stake ? (parseFloat(stake) * totalOdds).toFixed(2) : '0.00'} BP
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          <p className="text-[10px] text-gray-600 text-center">
            El juego con exceso puede causar adiccion. Juega con responsabilidad.
          </p>

          <button
            onClick={handleBet}
            disabled={loading || !stake || parseFloat(stake) <= 0}
            className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition text-sm"
          >
            {loading ? 'Procesando...' : 'Realizar apuesta'}
          </button>
        </div>
      )}
    </div>
  )
}
