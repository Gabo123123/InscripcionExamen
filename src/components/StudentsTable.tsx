import { useState, useMemo } from 'react'
import { Search, Edit2 } from 'lucide-react'

export type StudentData = {
  id: number
  nombres: string
  apellidos: string
  dni: string
  correo: string
  telefono: string
  carrera: string
  pagoValidado: string
  estadoRegistro: string
}

interface StudentsTableProps {
  students: StudentData[]
  onEdit?: (student: StudentData) => void
}

export default function StudentsTable({ students, onEdit }: StudentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCarrera, setFilterCarrera] = useState('todos')
  const [filterPago, setFilterPago] = useState('todos')

  const carreras = useMemo(() => {
    const unique = [...new Set(students.map(s => s.carrera))]
    return unique
  }, [students])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchSearch = 
        student.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.dni.includes(searchTerm) ||
        student.correo.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchCarrera = filterCarrera === 'todos' || student.carrera === filterCarrera
      const matchPago = filterPago === 'todos' || student.pagoValidado === filterPago

      return matchSearch && matchCarrera && matchPago
    })
  }, [students, searchTerm, filterCarrera, filterPago])

  const getPagoColor = (estado: string) => {
    return estado === 'Sí' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getEstadoColor = (estado: string) => {
    if (estado === 'Completo') return 'bg-blue-100 text-blue-800'
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nombre, DNI, correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtro por carrera */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Carrera</label>
          <select
            value={filterCarrera}
            onChange={(e) => setFilterCarrera(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            {carreras.map(carrera => (
              <option key={carrera} value={carrera}>{carrera}</option>
            ))}
          </select>
        </div>

        {/* Filtro por pago */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Pago Validado</label>
          <select
            value={filterPago}
            onChange={(e) => setFilterPago(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nombres</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Apellidos</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">DNI</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Carrera</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Pago</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-900">{student.nombres}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{student.apellidos}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{student.dni}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{student.carrera}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPagoColor(student.pagoValidado)}`}>
                      {student.pagoValidado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(student.estadoRegistro)}`}>
                      {student.estadoRegistro}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit?.(student)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-medium text-sm"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron alumnos con los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3 pt-4">
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total de Registros</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{filteredStudents.length}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Pagos Validados</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {filteredStudents.filter(s => s.pagoValidado === 'Sí').length}
          </p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">Pagos Pendientes</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {filteredStudents.filter(s => s.pagoValidado === 'No').length}
          </p>
        </div>
      </div>
    </div>
  )
}
