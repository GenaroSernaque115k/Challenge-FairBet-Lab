import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { X } from 'lucide-react'

interface LoginModalProps {
  onClose: () => void
  onRegisterClick: () => void
}

export default function LoginModal({ onClose, onRegisterClick }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      onClose()
    } catch {
      setError('Credenciales invalidas')
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
          <div>
            <img src="/LOGO.PNG" alt="FairBet" className="h-6 w-auto mb-3" />
            <h2 className="text-xl font-bold">Iniciar Sesion</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
              placeholder="demo1"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          No tienes cuenta?{' '}
          <button onClick={onRegisterClick} className="text-primary-500 hover:text-primary-400 font-medium transition">
            Registrarse
          </button>
        </p>
      </div>
    </div>
  )
}
