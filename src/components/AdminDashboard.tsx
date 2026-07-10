// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminNavigation from './AdminNavigation'
import StudentsTable from './StudentsTable'
import StudentDetailModal from './StudentDetailModal'
import type { StudentData } from './StudentsTable'
import type { FormData } from '../App'
import { fetchPostulantes, fetchPostulanteDetalle, type StudentListItem } from '../api'

interface AdminDashboardProps {
  onLogout: () => void
}

// Tipo combinado para el modal
type StudentWithDetails = Omit<FormData, 'pagoValidado'> & {
  id: number
  pagoValidado: string
  estadoRegistro: string
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentWithDetails | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [students, setStudents] = useState<StudentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Cargar postulantes desde la API real
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true)
      setLoadError('')
      try {
        const data = await fetchPostulantes()
        const mapped: StudentData[] = data.map((p: StudentListItem) => ({
          id: p.id,
          nombres: p.nombres,
          apellidos: `${p.apellido_paterno}${p.apellido_materno ? ' ' + p.apellido_materno : ''}`,
          dni: p.nro_documento,
          correo: p.correo || '',
          telefono: p.telefono1 || '',
          carrera: p.escuela_profesional || 'No definida',
          pagoValidado: p.pago_validado ? 'Sí' : 'No',
          estadoRegistro: p.estado_registro,
        }))
        setStudents(mapped)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al cargar postulantes'
        setLoadError(msg)
      } finally {
        setIsLoading(false)
      }
    }
    loadStudents()
  }, [])


  // Datos completos por estudiante (FormData)
  const _studentsCompleteData: Record<number, StudentWithDetails> = {
    1: {
      id: 1,
      nombres: 'Hugo',
      foto: '',
      apellidoPaterno: 'Rojas',
      apellidoMaterno: 'García',
      tipoDocumento: 'DNI',
      nroDocumento: '12345678',
      fechaNacimiento: '1995-03-15',
      sexo: 'Masculino',
      procedencia: 'Perú',
      paisNacimiento: 'Perú',
      departamentoNacimiento: 'Ica',
      provinciaNacimiento: 'Ica',
      distritoNacimiento: 'Ica',
      departamentoDomicilio: 'Ica',
      provinciaDomicilio: 'Ica',
      distritoDomicilio: 'Ica',
      direccion: 'Calle Las Palmeras 187, Urb. San José',
      correo: 'hugo.rojas@example.com',
      telefono1: '956123456',
      telefono2: '957654321',
      trabaja: true,
      ocupacion: 'Ingeniero',
      condicionLaboral: 'Independiente',
      institucionEmpresa: 'Consultora XYZ',
      familiarTipo: 'Padre',
      familiarNombre: 'Juan Rojas',
      familiarRelacion: 'Padre',
      familiarOcupacion: 'Contador',
      familiarCentro: 'Empresa ABC',
      familiarTelefono: '956123456',
      familiarCorreo: 'juan.rojas@example.com',
      numeroHijos: '0',
      tipoEducacion: 'Privado',
      estudiosConcluidos: 'Sí',
      departamentoEstudio: 'Ica',
      provinciaEstudio: 'Ica',
      institucionEducativa: 'Colegio San Luis Gonzaga',
      periodoInicio: '2013',
      periodoFin: '2018',
      discapacidad: 'Ninguna',
      discapacidadDetalle: '',
      preparacionUniversitaria: 'Academia particular',
      medioDifusion: 'Internet',
      areaAcademica: 'Ingeniería',
      escuelaProfesional: 'Ingeniería Civil',
      programaAcademico: 'Programa Regular',
      docIdentidad: 'DNI_12345678.pdf',
      certificadoEstudios: 'certificado_estudios.pdf',
      compromisoEstudios: '',
      declaracionAntecedentes: 'declaracion_antecedentes.pdf',
      declaracionVeracidad: 'declaracion_veracidad.pdf',
      aceptaTerminos: true,
      sexo: 'Femenino',
      procedencia: 'Perú',
      paisNacimiento: 'Perú',
      departamentoNacimiento: 'Lima',
      provinciaNacimiento: 'Lima',
      distritoNacimiento: 'Surco',
      departamentoDomicilio: 'Ica',
      provinciaDomicilio: 'Ica',
      distritoDomicilio: 'Ica',
      direccion: 'Av. Ejercito 456',
      correo: 'maria.cortes@example.com',
      telefono1: '987456123',
      telefono2: '',
      trabaja: false,
      ocupacion: '',
      condicionLaboral: '',
      institucionEmpresa: '',
      familiarTipo: 'Madre',
      familiarNombre: 'Rosa Mendoza',
      familiarRelacion: 'Madre',
      familiarOcupacion: 'Docente',
      familiarCentro: 'IE Estatal',
      familiarTelefono: '987456123',
      familiarCorreo: 'rosa.mendoza@example.com',
      numeroHijos: '1',
      tipoEducacion: 'Público',
      estudiosConcluidos: 'Sí',
      departamentoEstudio: 'Lima',
      provinciaEstudio: 'Lima',
      institucionEducativa: 'IE República Argentina',
      periodoInicio: '2012',
      periodoFin: '2017',
      discapacidad: 'Ninguna',
      discapacidadDetalle: '',
      preparacionUniversitaria: 'CEPU-UNICA',
      medioDifusion: 'Redes Sociales',
      areaAcademica: 'Administración',
      escuelaProfesional: 'Administración',
      programaAcademico: 'Programa Regular',
      docIdentidad: 'DNI_87654321.pdf',
      certificadoEstudios: 'certificado_estudios.pdf',
      compromisoEstudios: '',
      declaracionAntecedentes: 'declaracion_antecedentes.pdf',
      declaracionVeracidad: 'declaracion_veracidad.pdf',
      aceptaTerminos: true,
      proceso: '2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO',
      modalidad: 'ADMISIÓN ORDINARIA',
      estadoCivil: 'Soltera',
      educacionExtranjeroEsp: '',
      medioDifusionEspecifico: '',
      pagoValidado: 'Sí',
      estadoRegistro: 'Completo'
    },
  }

  const handleEdit = async (student: StudentData) => {
    try {
      const data = await fetchPostulanteDetalle(student.id)
      // Mapear los campos de la API al formato que espera StudentDetailModal
      const mapped = data as unknown as StudentWithDetails
      setSelectedStudent(mapped)
      setShowDetailModal(true)
    } catch {
      // Si falla, mostramos los datos básicos de la tabla
      const fallback: StudentWithDetails = {
        id: student.id,
        nombres: student.nombres,
        apellidoPaterno: student.apellidos.split(' ')[0] || '',
        apellidoMaterno: student.apellidos.split(' ').slice(1).join(' ') || '',
        tipoDocumento: 'DNI',
        nroDocumento: student.dni,
        fechaNacimiento: '',
        sexo: 'No especifica',
        procedencia: 'Perú',
        paisNacimiento: 'Perú',
        departamentoNacimiento: '',
        provinciaNacimiento: '',
        distritoNacimiento: '',
        departamentoDomicilio: '',
        provinciaDomicilio: '',
        distritoDomicilio: '',
        direccion: '',
        correo: student.correo,
        telefono1: student.telefono,
        telefono2: '',
        trabaja: false,
        ocupacion: '',
        condicionLaboral: '',
        institucionEmpresa: '',
        familiarTipo: 'Ninguno',
        familiarNombre: '',
        familiarRelacion: '',
        familiarOcupacion: '',
        familiarCentro: '',
        familiarTelefono: '',
        familiarCorreo: '',
        numeroHijos: '0',
        tipoEducacion: 'Público',
        estudiosConcluidos: 'Sí',
        departamentoEstudio: '',
        provinciaEstudio: '',
        institucionEducativa: '',
        periodoInicio: '',
        periodoFin: '',
        discapacidad: 'Ninguna',
        discapacidadDetalle: '',
        preparacionUniversitaria: '',
        medioDifusion: 'Internet',
        areaAcademica: '',
        escuelaProfesional: student.carrera,
        programaAcademico: '',
        docIdentidad: '',
        certificadoEstudios: '',
        compromisoEstudios: '',
        declaracionAntecedentes: '',
        declaracionVeracidad: '',
        aceptaTerminos: false,
        proceso: '2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO',
        modalidad: 'ADMISIÓN ORDINARIA',
        estadoCivil: 'Soltero',
        educacionExtranjeroEsp: '',
        medioDifusionEspecifico: '',
        pagoValidado: student.pagoValidado,
        estadoRegistro: student.estadoRegistro,
      }
      setSelectedStudent(fallback)
      setShowDetailModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNavigation onLogout={onLogout} />

        {/* Título y descripción */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Alumnos Registrados</h2>
          <p className="mt-2 text-slate-600">
            Gestiona y visualiza todos los alumnos inscritos para el Proceso de Admisión 2026-1 de la Universidad Nacional San Luis Gonzaga de Ica.
          </p>
        </div>

        {/* Tabla de estudiantes */}
        <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-300/30 ring-1 ring-slate-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="text-sm font-medium">Cargando postulantes...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-500">
              <p className="text-base font-semibold mb-2">Error al cargar datos</p>
              <p className="text-sm text-slate-500">{loadError}</p>
              <p className="text-xs text-slate-400 mt-2">Verifica que el backend esté corriendo en http://localhost:8000</p>
            </div>
          ) : (
            <StudentsTable students={students} onEdit={handleEdit} />
          )}
        </div>
      </div>

      <StudentDetailModal
        visible={showDetailModal}
        student={selectedStudent}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  )
}
