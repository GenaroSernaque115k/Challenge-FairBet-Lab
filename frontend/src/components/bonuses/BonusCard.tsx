import type { Bonus } from '../../services/bonuses'

interface BonusCardProps {
  bonus: Bonus
  onClaim: (bonusId: number) => void
  disabled?: boolean
  claimed?: boolean
}

export default function BonusCard({ bonus, onClaim, disabled, claimed }: BonusCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
          bonus.tipo === 'bienvenida'
            ? 'bg-primary-500/10 text-primary-400'
            : 'bg-blue-500/10 text-blue-400'
        }`}>
          {bonus.tipo === 'bienvenida' ? 'Bienvenida' : 'Recarga'}
        </span>
        <span className="text-2xl font-bold text-primary-400">{bonus.porcentaje}%</span>
      </div>

      <h3 className="font-bold text-lg mb-1">{bonus.nombre}</h3>
      <p className="text-xs text-gray-400 mb-4">{bonus.descripcion}</p>

      <div className="bg-black rounded-lg p-3 mb-4 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Monto maximo</span>
          <span className="text-white font-semibold">{parseFloat(bonus.monto_max).toFixed(0)} BP</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Rollover</span>
          <span className="text-white font-semibold">x{bonus.rollover_requerido}</span>
        </div>
      </div>

      {claimed ? (
        <div className="w-full py-2.5 rounded-lg text-xs font-semibold text-center bg-green-900/20 text-green-400 border border-green-800">
          Reclamado
        </div>
      ) : (
        <button
          onClick={() => onClaim(bonus.id)}
          disabled={disabled}
          className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-lg transition text-sm"
        >
          {disabled ? 'Procesando...' : 'Reclamar ahora'}
        </button>
      )}
    </div>
  )
}
