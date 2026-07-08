import { useState } from 'react'
import { X, Download, Eye } from 'lucide-react'
import type { FormData } from '../App'

interface StudentDetailModalProps {
  visible: boolean
  student: (FormData & { id: number; pagoValidado: string; estadoRegistro: string }) | null
  onClose: () => void
}

export default function StudentDetailModal({ visible, student, onClose }: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'documentos'>('personal')

  if (!visible || !student) return null

  const documentos = [
    { name: 'Documento Nacional de Identidad', uploaded: true, file: 'DNI_12345678.pdf' },
    { name: 'Declaración Jurada de Veracidad', uploaded: true, file: 'declaracion_veracidad.pdf' },
    { name: 'Certificado de Estudios', uploaded: true, file: 'certificado_estudios.pdf' },
    { name: 'Declaración de Antecedentes Penales', uploaded: true, file: 'declaracion_antecedentes.pdf' },
    { name: 'Compromiso de Estudios', uploaded: false, file: null },
  ]

  const renderField = (label: string, value: string | boolean, isEditable: boolean = false) => {
    return (
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
        <div className={`px-3 py-2 rounded-lg border ${isEditable ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
          <p className="text-sm text-slate-900">
            {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value || '-'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Información del Alumno</h2>
            <p className="text-sm text-slate-600 mt-1">{student.nombres} {student.apellidoPaterno}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 transition"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-4 font-medium text-sm transition ${
              activeTab === 'personal'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-6 py-4 font-medium text-sm transition ${
              activeTab === 'documentos'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Documentos Requisitos
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {activeTab === 'personal' && (
            <div className="space-y-8">
              {/* Resumen Rápido */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen Rápido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">👤 Postulante</p>
                    <p className="text-sm font-semibold text-blue-900">{student.nombres} {student.apellidoPaterno}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-xs text-green-600 font-medium mb-1">💳 Pago Validado</p>
                    <p className="text-sm font-semibold text-green-900">{student.pagoValidado}</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-1">ℹ️ Proceso</p>
                    <p className="text-sm font-semibold text-purple-900">{student.proceso}</p>
                  </div>
                </div>
              </div>

              {/* Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Datos Personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('Nombres', student.nombres)}
                  {renderField('Apellido Paterno', student.apellidoPaterno)}
                  {renderField('Apellido Materno', student.apellidoMaterno)}
                  {renderField('Tipo de Documento', student.tipoDocumento)}
                  {renderField('Nro. Documento', student.nroDocumento)}
                  {renderField('Sexo', student.sexo)}
                  {renderField('Fecha de Nacimiento', student.fechaNacimiento)}
                  {renderField('Estado Civil', student.estadoCivil)}
                  {renderField('Número de Hijos', student.numeroHijos)}
                </div>
              </div>

              {/* Procedencia y Lugar de Nacimiento */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Procedencia y Lugar de Nacimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {renderField('Procedencia', student.procedencia)}
                  {renderField('País de Nacimiento', student.paisNacimiento)}
                  {renderField('Departamento', student.departamentoNacimiento)}
                  {renderField('Provincia', student.provinciaNacimiento)}
                  {renderField('Distrito', student.distritoNacimiento)}
                </div>
              </div>

              {/* Dirección y Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Dirección y Contacto</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Domicilio Actual</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {renderField('Departamento', student.departamentoDomicilio)}
                      {renderField('Provincia', student.provinciaDomicilio)}
                      {renderField('Distrito', student.distritoDomicilio)}
                      {renderField('Dirección Exacta', student.direccion)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Datos de Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderField('Correo Electrónico', student.correo)}
                      {renderField('Teléfono 1', student.telefono1)}
                      {renderField('Teléfono 2', student.telefono2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ocupación */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Ocupación</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {renderField('¿Se encuentra trabajando?', student.trabaja)}
                  {student.trabaja && (
                    <>
                      {renderField('Ocupación/Cargo', student.ocupacion)}
                      {renderField('Condición Laboral', student.condicionLaboral)}
                      {renderField('Institución/Empresa', student.institucionEmpresa)}
                    </>
                  )}
                </div>
              </div>

              {/* Familiares y Apoderado */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Familiares y/o Apoderado</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {renderField('Tipo de Familiar', student.familiarTipo)}
                  {student.familiarTipo !== 'Ninguno' && (
                    <>
                      {renderField('Nombre', student.familiarNombre)}
                      {renderField('Relación', student.familiarRelacion)}
                      {renderField('Ocupación', student.familiarOcupacion)}
                      {renderField('Centro de Trabajo', student.familiarCentro)}
                      {renderField('Teléfono', student.familiarTelefono)}
                      {renderField('Correo', student.familiarCorreo)}
                    </>
                  )}
                </div>
              </div>

              {/* Estudios Secundarios */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Estudios Secundarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {renderField('Tipo de Educación', student.tipoEducacion)}
                  {renderField('Estudios Concluidos', student.estudiosConcluidos)}
                  {renderField('Departamento', student.departamentoEstudio)}
                  {renderField('Provincia', student.provinciaEstudio)}
                  {renderField('Institución Educativa', student.institucionEducativa)}
                  {renderField('Año Inicio', student.periodoInicio)}
                  {renderField('Año Fin', student.periodoFin)}
                </div>
              </div>

              {/* Información Adicional */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('¿Presenta discapacidad?', student.discapacidad)}
                  {student.discapacidad !== 'Ninguna' && renderField('Detalle de Discapacidad', student.discapacidadDetalle)}
                  {renderField('Preparación Universitaria', student.preparacionUniversitaria)}
                </div>
              </div>

              {/* Datos de Postulación */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Datos de Postulación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('Medio por el cual se enteró', student.medioDifusion)}
                  {renderField('Área Académica', student.areaAcademica)}
                  {renderField('Escuela Profesional', student.escuelaProfesional)}
                  {renderField('Programa Académico', student.programaAcademico)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Documentos Requisitos Obligatorios</h3>
              <div className="space-y-3">
                {documentos.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      doc.uploaded
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      {doc.uploaded && <p className="text-sm text-slate-600">{doc.file}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {doc.uploaded ? (
                        <>
                          <button className="p-2 rounded-lg hover:bg-green-200 transition text-green-700">
                            <Eye size={18} title="Ver documento" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-green-200 transition text-green-700">
                            <Download size={18} title="Descargar documento" />
                          </button>
                        </>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-200 text-red-700 text-xs font-medium">
                          No Subido
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de Documentos */}
              <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Resumen:</span> {documentos.filter(d => d.uploaded).length} de {documentos.length} documentos subidos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-8 py-4 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
