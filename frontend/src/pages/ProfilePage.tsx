import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBalanceStore } from '../store/balanceStore'
import LimitSettings from '../components/user/LimitSettings'
import AutoExclusionForm from '../components/user/AutoExclusionForm'

export default function ProfilePage() {
  const { user } = useAuth()
  const { balance } = useBalanceStore()
  const [tab, setTab] = useState<'info' | 'limits' | 'exclusion'>('info')

  if (!user) return <div className="text-gray-500 text-center py-20">Debes iniciar sesion</div>

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-xl font-bold mb-6">Mi Perfil</h1>

      <div className="flex gap-1 mb-6">
        {[
          { key: 'info', label: 'Informacion' },
          { key: 'limits', label: 'Limites' },
          { key: 'exclusion', label: 'Autoexclusion' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === key
                ? 'bg-primary-500 text-black'
                : 'bg-[#1a1a1a] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-black text-xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-lg">{user.username}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black rounded-lg px-4 py-3">
              <span className="text-[10px] text-gray-500 block">Saldo</span>
              <span className="text-primary-400 font-bold">{balance.toFixed(4)} BP</span>
            </div>
            <div className="bg-black rounded-lg px-4 py-3">
              <span className="text-[10px] text-gray-500 block">Estado</span>
              <span className={`text-sm font-semibold ${
                user.estado_cuenta === 'verificado' ? 'text-green-400' :
                user.estado_cuenta === 'autoexcluido' ? 'text-yellow-400' :
                'text-gray-400'
              }`}>
                {user.estado_cuenta === 'verificado' ? 'Verificado' :
                 user.estado_cuenta === 'autoexcluido' ? 'Autoexcluido' :
                 user.estado_cuenta === 'bloqueado' ? 'Bloqueado' :
                 'Pendiente'}
              </span>
            </div>
            <div className="bg-black rounded-lg px-4 py-3">
              <span className="text-[10px] text-gray-500 block">DNI</span>
              <span className="text-sm text-white">{user.dni}</span>
            </div>
            <div className="bg-black rounded-lg px-4 py-3">
              <span className="text-[10px] text-gray-500 block">Miembro desde</span>
              <span className="text-sm text-white">
                {new Date(user.date_joined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === 'limits' && <LimitSettings />}
      {tab === 'exclusion' && <AutoExclusionForm />}
    </div>
  )
}
