import { useState } from 'react'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

interface LoginModalProps {
  visible: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => void
  isLoading?: boolean
  error?: string
}

export default function LoginModal({ visible, onClose, onLogin, isLoading = false, error }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    onLogin(username, password)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-md ring-2 ring-blue-200">
            <img 
              src="https://www.unica.edu.pe/transparencia/img/unica.png" 
              alt="Logo UNICA" 
              className="h-full w-full object-contain p-1"
            />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-2">Acceso Administrador</h2>
        <p className="text-center text-sm text-slate-600 mb-6">
          Ingresa tus credenciales para acceder al panel
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition"
            >
              {isLoading ? 'Verificando...' : 'Ingresar'}
            </button>
          </div>
        </form>

        {/* Tip */}
        <div className="mt-6 rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700 border border-blue-200">
          <p className="font-medium mb-1">Demo:</p>
          <p>Usuario: <code className="font-mono bg-white px-1 rounded">admin</code></p>
          <p>Contraseña: <code className="font-mono bg-white px-1 rounded">admin123</code></p>
        </div>
      </div>
    </div>
  )
}
