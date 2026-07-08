import { LogOut } from 'lucide-react'

interface AdminNavigationProps {
  onLogout: () => void
}

export default function AdminNavigation({ onLogout }: AdminNavigationProps) {
  return (
    <header className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-5 shadow-lg shadow-blue-600/30 backdrop-blur-sm ring-1 ring-blue-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md">
            <img 
              src="https://www.unica.edu.pe/transparencia/img/unica.png" 
              alt="Logo UNICA" 
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-100">Panel de Administración</p>
            <h1 className="text-2xl font-semibold text-white">Administrador - CECA</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 px-4 py-2">
            <p className="text-sm font-medium text-white">2026-1 Ordinario</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
