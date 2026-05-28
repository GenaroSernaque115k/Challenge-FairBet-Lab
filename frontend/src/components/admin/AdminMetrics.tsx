import type { OperatorMetrics } from '../../services/operator'
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react'

interface AdminMetricsProps {
  metrics: OperatorMetrics | null
}

export default function AdminMetrics({ metrics }: AdminMetricsProps) {
  if (!metrics) return <p className="text-gray-500 text-center py-8">Cargando metricas...</p>

  const cards = [
    {
      label: 'GGR',
      value: `${parseFloat(metrics.ggr).toFixed(2)} BP`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Total Apostado',
      value: `${parseFloat(metrics.total_stakes).toFixed(2)} BP`,
      icon: TrendingUp,
      color: 'text-primary-400',
      bg: 'bg-primary-400/10',
    },
    {
      label: 'Total Pagado',
      value: `${parseFloat(metrics.total_payouts).toFixed(2)} BP`,
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Usuarios Activos',
      value: String(metrics.active_users),
      icon: Users,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'Apuestas Activas',
      value: String(metrics.active_bets),
      icon: Activity,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      label: 'Total Apuestas',
      value: String(metrics.total_bets),
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${c.bg}`}>
              <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
            </div>
            <span className="text-xs text-gray-500">{c.label}</span>
          </div>
          <p className="text-xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
