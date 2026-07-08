import type { FormData } from '../App'

interface ApplicationFormProps {
  form: FormData
  edad: string
  onChange: (key: keyof FormData, value: string | boolean) => void
  onBack: () => void
  onSubmit: () => void
}

const sexoOptions = ['No especifica', 'Masculino', 'Femenino']
const familiarOptions = ['Ninguno', 'Madre', 'Padre', 'Otro']
const tipoEducacionOptions = ['Público', 'Privado', 'Extranjero']
const estudiosConcluidosOptions = ['Sí', 'No', 'cursando 5° año', 'Otros casos']
const discapacidadOptions = ['Ninguna', 'Sí']
const medioDifusionOptions = ['Internet', 'Redes Sociales', 'Familia y/o amigos', 'Otro']

// Helper para mantener consistencia en las clases de los inputs
const inputClasses = "w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
const fileInputClasses = "block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"

export default function ApplicationForm({ form, edad, onChange, onBack, onSubmit }: ApplicationFormProps) {
  return (
    <section className="space-y-8">
      {/* Datos Personales */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Datos Personales</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Nombres *
                <input
                  value={form.nombres || ''}
                  onChange={(event) => onChange('nombres', event.target.value)}
                  placeholder="Nombres"
                  className={inputClasses}
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Apellido Paterno *
                <input
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
                <input
                  type="date"
                  value={form.fechaNacimiento || ''}
                  onChange={(event) => onChange('fechaNacimiento', event.target.value)}
                  className={inputClasses}
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Edad
                <input
                  type="text"
                  value={edad}
                  readOnly
                  className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Estado Civil *
                <select
                  value={form.estadoCivil || ''}
                  onChange={(event) => onChange('estadoCivil', event.target.value)}
                  className={inputClasses}
                >
                  <option value="">Seleccionar</option>
                  <option>Soltero</option>
                  <option>Casado</option>
                  <option>Divorciado</option>
                  <option>Viudo</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                N° de hijos *
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

          <div className="rounded-3xl bg-slate-50 p-6 text-slate-700 ring-1 ring-slate-200 h-fit">
            <p className="mb-4 text-xl font-semibold text-slate-900">Resumen rápido</p>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
                <span className="text-slate-500">👤</span>
                <div>
                  <dt className="font-semibold text-slate-900">Postulante</dt>
                  <dd>{form.nombres || 'Nombres'} {form.apellidoPaterno || 'Apellido'}</dd>
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
              onChange={(event) => onChange('procedencia', event.target.value)}
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
            >
              <option value="">Seleccionar</option>
              <option>Perú</option>
              {/* Más opciones de países */}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Departamento
            <select
              value={form.departamentoNacimiento || ''}
              onChange={(event) => onChange('departamentoNacimiento', event.target.value)}
              className={inputClasses}
            >
              <option value="">Seleccionar</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Provincia
            <select
              value={form.provinciaNacimiento || ''}
              onChange={(event) => onChange('provinciaNacimiento', event.target.value)}
              className={inputClasses}
            >
              <option value="">Seleccionar</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Distrito
            <select
              value={form.distritoNacimiento || ''}
              onChange={(event) => onChange('distritoNacimiento', event.target.value)}
              className={inputClasses}
            >
              <option value="">Seleccionar</option>
            </select>
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
                <select onChange={(e) => onChange('departamentoActual', e.target.value)} className={inputClasses}>
                  <option value="">Seleccionar</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Provincia *
                <select onChange={(e) => onChange('provinciaActual', e.target.value)} className={inputClasses}>
                  <option value="">Seleccionar</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Distrito *
                <select onChange={(e) => onChange('distritoActual', e.target.value)} className={inputClasses}>
                  <option value="">Seleccionar</option>
                </select>
              </label>
            </div>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Dirección exacta *
              <input
                value={form.direccionActual || ''}
                onChange={(e) => onChange('direccionActual', e.target.value)}
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

      {/* Ocupación */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Ocupación</h2>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.trabajaActualmente}
              onChange={(e) => onChange('trabajaActualmente', e.target.checked)}
              className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            ¿Se encuentra trabajando actualmente?
          </label>
        </div>
        
        {form.trabajaActualmente && (
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
                value={form.empresa || ''}
                onChange={(e) => onChange('empresa', e.target.value)}
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
                onClick={() => onChange('tipoFamiliar', option)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  form.tipoFamiliar === option
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {form.tipoFamiliar && form.tipoFamiliar !== 'Ninguno' && (
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Nombre completo *
              <input onChange={(e) => onChange('familiarNombre', e.target.value)} placeholder="Nombres completos" className={inputClasses} />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Relación *
              <input onChange={(e) => onChange('familiarRelacion', e.target.value)} placeholder="Ej. Tío, Abuelo" className={inputClasses} disabled={form.tipoFamiliar === 'Madre' || form.tipoFamiliar === 'Padre'} value={form.tipoFamiliar !== 'Otro' ? form.tipoFamiliar : form.familiarRelacion || ''} />
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
              <input onChange={(e) => onChange('familiarCentroLaboral', e.target.value)} placeholder="Empresa" className={inputClasses} />
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
              <input className={`${inputClasses} mt-2`} placeholder="Especificar país/sistema" onChange={(e) => onChange('educacionExtranjeroEsp', e.target.value)} />
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
              <select onChange={(e) => onChange('colegioDep', e.target.value)} className={inputClasses}><option>Seleccionar</option></select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Provincia
              <select onChange={(e) => onChange('colegioProv', e.target.value)} className={inputClasses}><option>Seleccionar</option></select>
            </label>
            <label className="col-span-2 space-y-2 text-sm font-medium text-slate-700">
              Institución Educativa *
              <select onChange={(e) => onChange('colegio', e.target.value)} className={inputClasses}><option>Seleccione un colegio</option></select>
            </label>
          </div>
          
          <div className="grid gap-4 grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">Año Inicio <input type="number" placeholder="Ej. 2018" className={inputClasses} /></label>
            <label className="space-y-2 text-sm font-medium text-slate-700">Año Fin <input type="number" placeholder="Ej. 2023" className={inputClasses} /></label>
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
                  <input className={`${inputClasses} mt-2`} placeholder="Especifique su discapacidad" onChange={(e) => onChange('discapacidadEspecifica', e.target.value)} />
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

          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Datos de Postulación</h2>
            <div className="space-y-4">
              <div className="space-y-2 text-sm font-medium text-slate-700">
                Medio por el cual te enteraste *
                <div className="flex flex-wrap gap-2">
                  {medioDifusionOptions.map(opt => (
                    <button type="button" key={opt} onClick={() => onChange('medioDifusion', opt)} className={`rounded-full px-4 py-2 text-sm transition ${form.medioDifusion === opt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{opt}</button>
                  ))}
                </div>
                {form.medioDifusion === 'Otro' && (
                  <input className={`${inputClasses} mt-2`} placeholder="Especifique el medio" onChange={(e) => onChange('medioDifusionEspecifico', e.target.value)} />
                )}
              </div>
              <label className="block space-y-2 text-sm font-medium text-slate-700">Área Académica <select className={inputClasses}><option>Seleccionar</option></select></label>
              <label className="block space-y-2 text-sm font-medium text-slate-700">Escuela Profesional a postular <select className={inputClasses}><option>Seleccionar</option></select></label>
              <label className="block space-y-2 text-sm font-medium text-slate-700">Programa Académico <select className={inputClasses}><option>Seleccionar</option></select></label>
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
                className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
              Acepto los Términos y Condiciones
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl bg-slate-100 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!form.aceptaTerminos}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Registrar Inscripción
        </button>
      </div>
    </section>
  )
}