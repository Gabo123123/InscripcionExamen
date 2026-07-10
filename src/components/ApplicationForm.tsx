import { useState, useEffect } from 'react'

import { toast } from 'react-hot-toast'
import type { FormData } from '../App'
import { countries, peruData } from '../data/locations'
import { areas, areaCareers } from '../data/careers'
import PhotoUpload from './PhotoUpload'
import modalImg from '../assets/modal.png'

interface ApplicationFormProps {
  form: FormData
  edad: string
  onChange: (key: keyof FormData, value: string | boolean) => void
  onBack: () => void
  onSubmit: () => void
  isSubmitting?: boolean
}

const sexoOptions = ['No especifica', 'Masculino', 'Femenino']
const familiarOptions = ['Ninguno', 'Madre', 'Padre', 'Otro']
const tipoEducacionOptions = ['Nacional', 'Privado', 'Extranjero']
const estudiosConcluidosOptions = ['Sí', 'cursando 5° año']
const discapacidadOptions = ['Ninguna', 'Sí']
const medioDifusionOptions = ['Internet', 'Redes Sociales', 'Familia y/o amigos', 'Otro']

// Helper para mantener consistencia en las clases de los inputs
const inputClasses = "w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
const fileInputClasses = "block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"

export default function ApplicationForm({ form, edad, onChange, onBack, onSubmit, isSubmitting = false }: ApplicationFormProps) {
  
  // Helpers para Ubigeo
  const departamentos = Object.keys(peruData).sort()
  
  const provinciasNacimiento = form.departamentoNacimiento && peruData[form.departamentoNacimiento] 
    ? Object.keys(peruData[form.departamentoNacimiento]).sort() 
    : []
  const distritosNacimiento = form.departamentoNacimiento && form.provinciaNacimiento && peruData[form.departamentoNacimiento]?.[form.provinciaNacimiento]
    ? peruData[form.departamentoNacimiento][form.provinciaNacimiento].sort()
    : []

  const provinciasDomicilio = form.departamentoDomicilio && peruData[form.departamentoDomicilio]
    ? Object.keys(peruData[form.departamentoDomicilio]).sort()
    : []
  const distritosDomicilio = form.departamentoDomicilio && form.provinciaDomicilio && peruData[form.departamentoDomicilio]?.[form.provinciaDomicilio]
    ? peruData[form.departamentoDomicilio][form.provinciaDomicilio].sort()
    : []

  const provinciasEstudio = form.departamentoEstudio && peruData[form.departamentoEstudio]
    ? Object.keys(peruData[form.departamentoEstudio]).sort()
    : []

  // Modal DNI Amarillo
  const [showMinorModal, setShowMinorModal] = useState(false)
  const [hasSeenMinorModal, setHasSeenMinorModal] = useState(false)

  useEffect(() => {
    if (edad && parseInt(edad) < 18 && !hasSeenMinorModal) {
      setShowMinorModal(true)
      setHasSeenMinorModal(true)
    }
  }, [edad, hasSeenMinorModal])

  const handleLocalSubmit = () => {
    const requiredFields = [
      { key: 'foto', label: 'Fotografía del Postulante', id: 'field-foto' },
      { key: 'nombres', label: 'Nombres', id: 'field-nombres' },
      { key: 'apellidoPaterno', label: 'Apellido Paterno', id: 'field-apellidoPaterno' },
      { key: 'tipoDocumento', label: 'Tipo de documento', id: 'field-tipoDocumento' },
      { key: 'nroDocumento', label: 'Nro. documento', id: 'field-nroDocumento' },
      { key: 'fechaNacimiento', label: 'Fecha de nacimiento', id: 'field-fechaNacimiento' },
      { key: 'departamentoDomicilio', label: 'Departamento (Domicilio)', id: 'field-departamentoDomicilio' },
      { key: 'areaAcademica', label: 'Área Académica', id: 'field-areaAcademica' },
      { key: 'escuelaProfesional', label: 'Carrera profesional a Postular', id: 'field-escuelaProfesional' }
    ]

    const missingField = requiredFields.find(f => !form[f.key as keyof FormData])
    if (missingField) {
      toast.error(`Información incompleta: Por favor registre su ${missingField.label}`, { 
        position: 'top-center',
        duration: 4000
      })
      
      const el = document.getElementById(missingField.id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'transition-all', 'duration-300')
        setTimeout(() => el.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2'), 3500)
      }
      return
    }
    
    onSubmit()
  }

  // Helper para cambios en cascada
  const handleLocationChange = (
    field: 'procedencia' | 'departamentoNacimiento' | 'provinciaNacimiento' | 'departamentoDomicilio' | 'provinciaDomicilio' | 'departamentoEstudio' | 'provinciaEstudio', 
    value: string
  ) => {
    onChange(field, value)
    
    // Resetear dependencias
    if (field === 'procedencia') {
      onChange('paisNacimiento', value === 'Perú' ? 'Perú' : '')
    } else if (field === 'departamentoNacimiento') {
      onChange('provinciaNacimiento', '')
      onChange('distritoNacimiento', '')
    } else if (field === 'provinciaNacimiento') {
      onChange('distritoNacimiento', '')
    } else if (field === 'departamentoDomicilio') {
      onChange('provinciaDomicilio', '')
      onChange('distritoDomicilio', '')
    } else if (field === 'provinciaDomicilio') {
      onChange('distritoDomicilio', '')
    } else if (field === 'departamentoEstudio') {
      onChange('provinciaEstudio', '')
    }
  }

  return (
    <section className="space-y-8">
      {/* Datos Personales y Fotografía */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        {/* Fotografía (Top Level) */}
        <div className="mb-10" id="field-foto">
          <PhotoUpload 
            onCapture={(base64) => onChange('foto', base64)} 
            currentImage={form.foto} 
          />
        </div>

        <div className="mb-6 border-t border-slate-100 pt-8">
          <h2 className="text-2xl font-semibold text-slate-900">Datos Personales</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Nombres *
                <input
                  id="field-nombres"
                  value={form.nombres || ''}
                  onChange={(event) => onChange('nombres', event.target.value)}
                  placeholder="Nombres"
                  className={inputClasses}
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Apellido Paterno *
                <input
                  id="field-apellidoPaterno"
                  value={form.apellidoPaterno || ''}
                  onChange={(event) => onChange('apellidoPaterno', event.target.value)}
                  placeholder="Apellido paterno"
                  className={inputClasses}
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Apellido Materno
                <input
                  value={form.apellidoMaterno || ''}
                  onChange={(event) => onChange('apellidoMaterno', event.target.value)}
                  placeholder="Apellido materno"
                  className={inputClasses}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Tipo de documento *
                <select
                  id="field-tipoDocumento"
                  value={form.tipoDocumento || ''}
                  onChange={(event) => onChange('tipoDocumento', event.target.value)}
                  className={inputClasses}
                >
                  <option value="">Seleccionar</option>
                  <option>DNI</option>
                  <option>Carné de Extranjería</option>
                  <option>Pasaporte</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Nro. documento *
                <input
                  id="field-nroDocumento"
                  value={form.nroDocumento || ''}
                  onChange={(event) => onChange('nroDocumento', event.target.value)}
                  placeholder="Ej. 70314759"
                  className={inputClasses}
                />
              </label>
              <div className="space-y-2 text-sm font-medium text-slate-700">
                Sexo *
                <div className="flex flex-wrap gap-2">
                  {sexoOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => onChange('sexo', option)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        form.sexo === option
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Fecha de nacimiento *
                <div className="flex gap-2">
                  <input
                    id="field-fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento || ''}
                    onChange={(event) => onChange('fechaNacimiento', event.target.value)}
                    className={inputClasses}
                  />
                </div>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Edad
                <input value={edad} readOnly className={`${inputClasses} cursor-not-allowed bg-slate-100 font-semibold`} />
              </label>
              <div className="grid gap-4 md:grid-cols-2 sm:col-span-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Estado Civil *
                  <select
                    value={form.estadoCivil || ''}
                    onChange={(event) => onChange('estadoCivil', event.target.value)}
                    className={inputClasses}
                  >
                    <option>Soltero</option>
                    <option>Casado</option>
                    <option>Viudo</option>
                    <option>Divorciado</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Número de hijos
                  <input
                    type="number"
                    min="0"
                    value={form.numeroHijos || ''}
                    onChange={(event) => onChange('numeroHijos', event.target.value)}
                    className={inputClasses}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 text-slate-700 ring-1 ring-slate-200 h-fit">
            <p className="mb-4 text-xl font-semibold text-slate-900">Resumen rápido</p>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
                <span className="text-slate-500">👤</span>
                <div>
                  <dt className="font-semibold text-slate-900">Postulante</dt>
                  <dd>{form.nombres || 'Nombres'} {form.apellidoPaterno || 'Apellido'} {form.apellidoMaterno || ''}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
                <span className="text-slate-500">💳</span>
                <div>
                  <dt className="font-semibold text-slate-900">Pago validado</dt>
                  <dd>{form.pagoValidado ? 'Sí' : 'Pendiente / No'}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
                <span className="text-slate-500">ℹ️</span>
                <div>
                  <dt className="font-semibold text-slate-900">Proceso</dt>
                  <dd>{form.proceso || 'Admisión 2026-1 Ordinario'}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Procedencia y Lugar de Nacimiento */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Procedencia y Lugar de Nacimiento</h2>
        <div className="grid gap-4 md:grid-cols-5">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Procedencia *
            <select
              value={form.procedencia || ''}
              onChange={(event) => handleLocationChange('procedencia', event.target.value)}
              className={inputClasses}
            >
              <option value="">Seleccionar</option>
              <option>Perú</option>
              <option>Extranjero</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            País *
            <select
              value={form.paisNacimiento || ''}
              onChange={(event) => onChange('paisNacimiento', event.target.value)}
              className={inputClasses}
              disabled={form.procedencia === 'Perú'}
            >
              <option value="">Seleccionar</option>
              {form.procedencia === 'Perú' ? (
                <option>Perú</option>
              ) : (
                countries.map(c => <option key={c}>{c}</option>)
              )}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Departamento
            {form.procedencia === 'Extranjero' ? (
              <input value={form.departamentoNacimiento || ''} onChange={(e) => onChange('departamentoNacimiento', e.target.value)} className={inputClasses} placeholder="Ingresar departamento/estado" />
            ) : (
              <select
                value={form.departamentoNacimiento || ''}
                onChange={(event) => handleLocationChange('departamentoNacimiento', event.target.value)}
                className={inputClasses}
              >
                <option value="">Seleccionar</option>
                {departamentos.map(d => <option key={d}>{d}</option>)}
              </select>
            )}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Provincia
            {form.procedencia === 'Extranjero' ? (
              <input value={form.provinciaNacimiento || ''} onChange={(e) => onChange('provinciaNacimiento', e.target.value)} className={inputClasses} placeholder="Ingresar provincia/ciudad" />
            ) : (
              <select
                value={form.provinciaNacimiento || ''}
                onChange={(event) => handleLocationChange('provinciaNacimiento', event.target.value)}
                className={inputClasses}
                disabled={!form.departamentoNacimiento}
              >
                <option value="">Seleccionar</option>
                {provinciasNacimiento.map(p => <option key={p}>{p}</option>)}
              </select>
            )}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Distrito
            {form.procedencia === 'Extranjero' ? (
              <input value={form.distritoNacimiento || ''} onChange={(e) => onChange('distritoNacimiento', e.target.value)} className={inputClasses} placeholder="Ingresar distrito" />
            ) : (
              <select
                value={form.distritoNacimiento || ''}
                onChange={(event) => onChange('distritoNacimiento', event.target.value)}
                className={inputClasses}
                disabled={!form.provinciaNacimiento}
              >
                <option value="">Seleccionar</option>
                {distritosNacimiento.map(d => <option key={d}>{d}</option>)}
              </select>
            )}
          </label>
        </div>
      </div>

      {/* Dirección y Contacto */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Dirección y Contacto</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold">Domicilio Actual</h3>
            <div className="grid gap-4 grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Departamento *
                <select 
                  id="field-departamentoDomicilio"
                  value={form.departamentoDomicilio || ''} 
                  onChange={(e) => handleLocationChange('departamentoDomicilio', e.target.value)} 
                  className={inputClasses}
                >
                  <option value="">Seleccionar</option>
                  {departamentos.map(d => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Provincia *
                <select 
                  value={form.provinciaDomicilio || ''} 
                  onChange={(e) => handleLocationChange('provinciaDomicilio', e.target.value)} 
                  className={inputClasses}
                  disabled={!form.departamentoDomicilio}
                >
                  <option value="">Seleccionar</option>
                  {provinciasDomicilio.map(p => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Distrito *
                <select 
                  value={form.distritoDomicilio || ''} 
                  onChange={(e) => onChange('distritoDomicilio', e.target.value)} 
                  className={inputClasses}
                  disabled={!form.provinciaDomicilio}
                >
                  <option value="">Seleccionar</option>
                  {distritosDomicilio.map(d => <option key={d}>{d}</option>)}
                </select>
              </label>
            </div>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Dirección exacta *
              <input
                value={form.direccion || ''}
                onChange={(e) => onChange('direccion', e.target.value)}
                placeholder="Av / Calle / Nro"
                className={inputClasses}
              />
            </label>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold">Datos de Contacto</h3>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Correo electrónico *
              <input
                type="email"
                value={form.correo || ''}
                onChange={(e) => onChange('correo', e.target.value)}
                placeholder="correo@ejemplo.com"
                className={inputClasses}
              />
            </label>
            <div className="grid gap-4 grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Teléfono 1 *
                <input
                  type="tel"
                  value={form.telefono1 || ''}
                  onChange={(e) => onChange('telefono1', e.target.value)}
                  placeholder="Celular principal"
                  className={inputClasses}
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Teléfono 2
                <input
                  type="tel"
                  value={form.telefono2 || ''}
                  onChange={(e) => onChange('telefono2', e.target.value)}
                  placeholder="Teléfono alternativo"
                  className={inputClasses}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Datos de Postulación */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Datos de Postulación</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Medio de difusión *
            <select
              value={form.medioDifusion || ''}
              onChange={(event) => onChange('medioDifusion', event.target.value)}
              className={inputClasses}
            >
              <option value="">Seleccionar</option>
              {medioDifusionOptions.map(m => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Especifique Canal
            <input
              value={form.medioDifusionEspecifico || ''}
              onChange={(event) => onChange('medioDifusionEspecifico', event.target.value)}
              placeholder="Ej. Facebook, Radio XYZ, etc."
              className={inputClasses}
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Área Académica *
            <select
              id="field-areaAcademica"
              value={form.areaAcademica || ''}
              onChange={(event) => {
                onChange('areaAcademica', event.target.value)
                onChange('escuelaProfesional', '') // Reset carrera al cambiar área
              }}
              className={inputClasses}
            >
              <option value="">Seleccionar Área</option>
              {areas.map(area => <option key={area}>{area}</option>)}
            </select>
          </label>
          
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Carrera profesional a Postular *
            <select
              id="field-escuelaProfesional"
              value={form.escuelaProfesional || ''}
              onChange={(event) => onChange('escuelaProfesional', event.target.value)}
              className={inputClasses}
              disabled={!form.areaAcademica}
            >
              <option value="">Seleccionar Carrera</option>
              {form.areaAcademica && areaCareers[form.areaAcademica]?.map(carrera => (
                <option key={carrera}>{carrera}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Ocupación */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Ocupación</h2>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.trabaja}
              onChange={(e) => onChange('trabaja', e.target.checked)}
              className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            ¿Se encuentra trabajando actualmente?
          </label>
        </div>

        {form.trabaja && (
          <div className="grid gap-4 md:grid-cols-3 animate-in fade-in slide-in-from-top-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Ocupación / Cargo
              <input
                value={form.ocupacion || ''}
                onChange={(e) => onChange('ocupacion', e.target.value)}
                placeholder="Ej. Asistente"
                className={inputClasses}
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Condición laboral
              <select
                value={form.condicionLaboral || ''}
                onChange={(e) => onChange('condicionLaboral', e.target.value)}
                className={inputClasses}
              >
                <option value="">Seleccionar</option>
                <option>Dependiente</option>
                <option>Independiente</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Institución o Empresa
              <input
                value={form.institucionEmpresa || ''}
                onChange={(e) => onChange('institucionEmpresa', e.target.value)}
                placeholder="Nombre de la empresa"
                className={inputClasses}
              />
            </label>
          </div>
        )}
      </div>

      {/* Familiares y/o Apoderado */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Familiares y/o Apoderado</h2>
        <div className="mb-6 space-y-2 text-sm font-medium text-slate-700">
          Seleccione familiar a registrar:
          <div className="flex flex-wrap gap-2">
            {familiarOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => onChange('familiarTipo', option)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  form.familiarTipo === option
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {form.familiarTipo && form.familiarTipo !== 'Ninguno' && (
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Nombre completo *
              <input onChange={(e) => onChange('familiarNombre', e.target.value)} placeholder="Nombres completos" className={inputClasses} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Relación *
              <input onChange={(e) => onChange('familiarRelacion', e.target.value)} placeholder="Ej. Tío, Abuelo" className={inputClasses} disabled={form.familiarTipo === 'Madre' || form.familiarTipo === 'Padre'} value={form.familiarTipo !== 'Otro' ? form.familiarTipo : form.familiarRelacion || ''} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Teléfono *
              <input type="tel" onChange={(e) => onChange('familiarTelefono', e.target.value)} placeholder="Teléfono" className={inputClasses} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Ocupación
              <input onChange={(e) => onChange('familiarOcupacion', e.target.value)} placeholder="Ocupación" className={inputClasses} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Centro Laboral
              <input value={form.familiarCentro || ''} onChange={(e) => onChange('familiarCentro', e.target.value)} placeholder="Empresa" className={inputClasses} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Correo electrónico
              <input type="email" onChange={(e) => onChange('familiarCorreo', e.target.value)} placeholder="Correo" className={inputClasses} />
            </label>
          </div>
        )}
      </div>

      {/* Educación, Adicional y Postulación */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Estudios Secundarios</h2>
          
          <div className="space-y-2 text-sm font-medium text-slate-700">
            Tipo de educación *
            <div className="flex gap-2">
              {tipoEducacionOptions.map(opt => (
                <button type="button" key={opt} onClick={() => onChange('tipoEducacion', opt)} className={`rounded-full px-4 py-2 text-sm transition ${form.tipoEducacion === opt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{opt}</button>
              ))}
            </div>
            {form.tipoEducacion === 'Extranjero' && (
              <input className={`${inputClasses} mt-2`} placeholder="Especificar país/sistema" value={form.educacionExtranjeroEsp || ''} onChange={(e) => onChange('educacionExtranjeroEsp', e.target.value)} />
            )}
          </div>

          <div className="space-y-2 text-sm font-medium text-slate-700">
            Estudios concluidos *
            <div className="flex flex-wrap gap-2">
              {estudiosConcluidosOptions.map(opt => (
                <button type="button" key={opt} onClick={() => onChange('estudiosConcluidos', opt)} className={`rounded-full px-4 py-2 text-sm transition ${form.estudiosConcluidos === opt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{opt}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Departamento
              <select value={form.departamentoEstudio || ''} onChange={(e) => handleLocationChange('departamentoEstudio', e.target.value)} className={inputClasses}>
                <option value="">Seleccionar</option>
                {departamentos.map(d => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Provincia
              <select value={form.provinciaEstudio || ''} onChange={(e) => onChange('provinciaEstudio', e.target.value)} className={inputClasses} disabled={!form.departamentoEstudio}>
                <option value="">Seleccionar</option>
                {provinciasEstudio.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="col-span-2 space-y-2 text-sm font-medium text-slate-700">
              Institución Educativa *
              <input 
                type="text" 
                value={form.institucionEducativa || ''} 
                onChange={(e) => onChange('institucionEducativa', e.target.value)} 
                className={inputClasses} 
                placeholder="Nombre del colegio / institución" 
              />
            </label>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Año Inicio
              <input type="number" placeholder="Ej. 2018" className={inputClasses} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Año Fin
              <input type="number" placeholder="Ej. 2023" className={inputClasses} />
            </label>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Información Adicional</h2>
            <div className="space-y-4">
              <div className="space-y-2 text-sm font-medium text-slate-700">
                ¿Presenta alguna discapacidad? *
                <div className="flex gap-2">
                  {discapacidadOptions.map(opt => (
                    <button type="button" key={opt} onClick={() => onChange('discapacidad', opt)} className={`rounded-full px-4 py-2 text-sm transition ${form.discapacidad === opt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{opt}</button>
                  ))}
                </div>
                {form.discapacidad === 'Sí' && (
                  <input className={`${inputClasses} mt-2`} placeholder="Especifique su discapacidad" value={form.discapacidadDetalle || ''} onChange={(e) => onChange('discapacidadDetalle', e.target.value)} />
                )}
              </div>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Preparación universitaria previa
                <select className={inputClasses}>
                  <option>Seleccionar</option>
                  <option>CEPU-UNICA</option>
                  <option>Academia particular</option>
                  <option>Autopreparación</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de requisitos anexos */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Lista de requisitos anexos</h2>
        <div className="space-y-5">
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Documento Nacional de Identidad - Actualizado - (obligatorio)*
            <input type="file" accept=".pdf,.doc,.docx" className={fileInputClasses} />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Compromiso de entregar certificado de estudios en caso de ingresar (Solo para 5to año)
            <input type="file" accept=".pdf,.doc,.docx" className={fileInputClasses} />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Declaración Jurada de veracidad de la documentación - (obligatorio)*
            <input type="file" accept=".pdf,.doc,.docx" className={fileInputClasses} />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Certificado de Estudios o Constancia de logros / 5to año. - (obligatorio)*
            <input type="file" accept=".pdf,.doc,.docx" className={fileInputClasses} />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Declaración Jurada de no tener antecedentes penales - (obligatorio)*
            <input type="file" accept=".pdf,.doc,.docx" className={fileInputClasses} />
          </label>
        </div>
      </div>

      {/* Términos y Envío */}
      <div className="rounded-3xl bg-orange-50 p-8 ring-1 ring-orange-200">
        <div className="flex gap-4">
          <span className="text-2xl">⚠️</span>
          <div className="space-y-4 text-sm text-orange-900">
            <p className="font-semibold text-base">Alerta de Información</p>
            <p>
              Declaro que la información proporcionada es verdadera y de mi entera responsabilidad. 
              En caso de comprobarse la falsedad de la misma o no cumplir con la entrega de los documentos 
              originales requeridos, acepto que la vacante obtenida será <strong>ANULADA</strong> sin derecho a reclamo.
            </p>
            <label className="flex items-center gap-3 font-semibold cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={!!form.aceptaTerminos}
                onChange={(e) => onChange('aceptaTerminos', e.target.checked)}
                className="h-5 w-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
              Acepto los Términos y Condiciones
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Volver atrás
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleLocalSubmit}
          className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Procesando...
            </>
          ) : 'Registrar Inscripción'}
        </button>
      </div>

      {/* Modal DNI Amarillo (Menores de edad) */}
      {showMinorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-slate-50 p-6 flex flex-col items-center">
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">COMUNICADO PARA LOS POSTULANTES CON D.N.I. AMARILLO</h2>
              </div>
              
              <img 
                src={modalImg} 
                alt="Comunicado DNI Amarillo" 
                className="max-h-[50vh] w-auto rounded-xl object-contain shadow-sm mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm font-medium text-slate-700 mb-8 max-w-4xl px-4">
                <p>LOS POSTULANTES AL EXAMEN DE ADMISIÓN 2026-1 MENORES DE EDAD CON D.N.I. AMARILLO</p>
                <p>DEBERÁN SUBIR UNA FOTO ACTUAL</p>
                <p>DESPUÉS DE SU PRE-INSCRIPCIÓN VIRTUAL ACERCARSE A LA OFICINA DE LA COMISIÓN EJECUTIVA CENTRAL DE ADMISIÓN (SITO CALLE LAS PALMERAS 187 URB. SAN JOSÉ) PARA CULMINAR SU INSCRIPCIÓN.</p>
              </div>

              <button
                onClick={() => setShowMinorModal(false)}
                className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}