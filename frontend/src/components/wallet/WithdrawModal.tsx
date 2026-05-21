import { useState, useEffect, useRef } from 'react'
import { ArrowUpFromLine, X } from 'lucide-react'
import { wallet as walletService } from '../../services/auth'
import { useBalanceStore } from '../../store/balanceStore'

interface WithdrawModalProps {
  onClose: () => void
}

export default function WithdrawModal({ onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { balance, setBalance } = useBalanceStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const idempotencyKey = crypto.randomUUID()
    try {
      const data = await walletService.retirar({ amount, idempotency_key: idempotencyKey })
      setBalance(parseFloat(data.balance))
      setSuccess(`Retiro exitoso. Nuevo saldo: ${parseFloat(data.balance).toFixed(4)} BP`)
      setAmount('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al retirar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <ArrowUpFromLine className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold">Retirar Fondos</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Monto (BP)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.0001"
              step="0.0001"
              max={balance}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
              placeholder="0.0000"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Saldo disponible: <span className="text-primary-400">{balance.toFixed(4)} BP</span>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) > balance}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? 'Procesando...' : 'Retirar'}
          </button>
        </form>
      </div>
    </div>
  )
}
