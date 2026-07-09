import { useState } from 'react'
import AdminNavigation from './AdminNavigation'
import StudentsTable from './StudentsTable'
import StudentDetailModal from './StudentDetailModal'
import type { StudentData } from './StudentsTable'
import type { FormData } from '../App'

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

  // Datos de ejemplo con información completa
  const [students] = useState<StudentData[]>([
    {
      id: 1,
      nombres: 'Hugo',
      apellidos: 'Rojas García',
      dni: '12345678',
      correo: 'hugo.rojas@example.com',
      telefono: '956123456',
      carrera: 'Ingeniería Civil',
      pagoValidado: 'Sí',
      estadoRegistro: 'Completo'
    },
    {
      id: 2,
      nombres: 'María',
      apellidos: 'Cortés Mendoza',
      dni: '87654321',
      correo: 'maria.cortes@example.com',
      telefono: '987456123',
      carrera: 'Administración',
      pagoValidado: 'Sí',
      estadoRegistro: 'Completo'
    },
    {
      id: 3,
      nombres: 'Carlos',
      apellidos: 'Hernández López',
      dni: '11223344',
      correo: 'carlos.hernandez@example.com',
      telefono: '951234567',
      carrera: 'Ingeniería Civil',
      pagoValidado: 'No',
      estadoRegistro: 'Pendiente'
    },
    {
      id: 4,
      nombres: 'Ana',
      apellidos: 'Martínez Silva',
      dni: '55667788',
      correo: 'ana.martinez@example.com',
      telefono: '943345678',
      carrera: 'Enfermería',
      pagoValidado: 'Sí',
      estadoRegistro: 'Completo'
    },
    {
      id: 5,
      nombres: 'Pedro',
      apellidos: 'González Torres',
      dni: '99887766',
      correo: 'pedro.gonzalez@example.com',
      telefono: '912345678',
      carrera: 'Administración',
      pagoValidado: 'No',
      estadoRegistro: 'Completo'
    },
  ])

  // Datos completos por estudiante (FormData)
  const studentsCompleteData: Record<number, StudentWithDetails> = {
    1: {
      id: 1,
      nombres: 'Hugo',
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
      proceso: '2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO',
      modalidad: 'ADMISIÓN ORDINARIA',
      estadoCivil: 'Soltero',
      educacionExtranjeroEsp: '',
      medioDifusionEspecifico: '',
      pagoValidado: 'Sí',
      estadoRegistro: 'Completo'
    },
    2: {
      id: 2,
      nombres: 'María',
      apellidoPaterno: 'Cortés',
      apellidoMaterno: 'Mendoza',
      tipoDocumento: 'DNI',
      nroDocumento: '87654321',
      fechaNacimiento: '1996-07-22',
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

  const handleEdit = (student: StudentData) => {
    const completeData = studentsCompleteData[student.id] || {
      ...student,
      id: student.id,
      apellidoPaterno: '',
      apellidoMaterno: '',
      tipoDocumento: 'DNI',
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
      telefono1: '',
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
      escuelaProfesional: '',
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
      pagoValidado: 'No',
      estadoRegistro: 'Pendiente'
    }
    
    setSelectedStudent(completeData)
    setShowDetailModal(true)
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
          <StudentsTable students={students} onEdit={handleEdit} />
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
