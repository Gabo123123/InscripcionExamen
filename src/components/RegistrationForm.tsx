import { toast } from 'react-hot-toast'
import type { FormData } from '../App'

interface RegistrationFormProps {
  form: FormData
  onChange: (key: keyof FormData, value: string | boolean) => void
  onContinue: () => void
  selectedColegio: string
  setSelectedColegio: (value: string) => void
  onOpenPayment: () => void
  paymentValidated: boolean
  montoRequerido: number
}

const colegioOptions = ['Nacional', 'Particular', 'Víctimas de terrorismo']

export default function RegistrationForm({
  form,
  onChange,
  onContinue,
  selectedColegio,
  setSelectedColegio,
  onOpenPayment,
  paymentValidated,
  montoRequerido,
}: RegistrationFormProps) {
  const handleContinue = () => {
    if (!form.nroDocumento) {
      toast.error('Debe ingresar su número de documento (DNI)', { position: 'top-center' })
      return
    }
    if (!paymentValidated) {
      toast.error('Debe validar el pago correspondiente', { position: 'top-center' })
      return
    }
    onContinue()
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-300/40 ring-1 ring-slate-200">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-slate-500">Formulario</p>
          <h2 className="text-3xl font-semibold text-slate-900">Inscripción de examen de admisión</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          📍 Ica, Perú
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Tipo de documento
            <select
              value={form.tipoDocumento}
              onChange={(event) => onChange('tipoDocumento', event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
              <option>DNI</option>
              <option>Carné de Extranjería</option>
              <option>Pasaporte</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Documento
            <input
              value={form.nroDocumento}
              onChange={(event) => onChange('nroDocumento', event.target.value)}
              placeholder="70314759"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Proceso de admisión
            <select
              value={form.proceso}
              onChange={(event) => {
                // Sincronizar modalidad con el proceso
                const newProceso = event.target.value
                onChange('proceso', newProceso)
                
                let newModalidad = 'ORDINARIO'
                if (newProceso.includes('TITULADO Y GRADUADO')) newModalidad = 'TITULADO Y GRADUADO'
                else if (newProceso.includes('PERSONA CON DISCAPACIDAD')) newModalidad = 'PERSONA CON DISCAPACIDAD'
                else if (newProceso.includes('VICTIMAS DE TERRORISMO')) newModalidad = 'ORDINARIO, VICTIMAS DE TERRORISMO'
                else if (newProceso.includes('DEPORTISTA DESTACADO')) newModalidad = 'DEPORTISTA DESTACADO'
                else if (newProceso.includes('1 Y 2 PUESTO')) newModalidad = '1 Y 2 PUESTO'
                onChange('modalidad', newModalidad)
              }}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
              <option>2026-2- PROCESO DE ADMISION 2026-1 ORDINARIO, VICTIMAS DE TERRORISMO</option>
              <option>2026-2- PROCESO DE ADMISION 2026-1 TITULADO Y GRADUADO</option>
              <option>2026-2- PROCESO DE ADMISION 2026-1 PERSONA CON DISCAPACIDAD</option>
              <option>2026-2- PROCESO DE ADMISIÓN 2026-1 DEPORTISTA DESTACADO</option>
              <option>2026-2-PROCESO DE ADMISIÓN 2026-1 1 Y 2 PUESTO</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Modalidad de admisión
            <select
              value={form.modalidad}
              onChange={(event) => onChange('modalidad', event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
              <option>ORDINARIO, VICTIMAS DE TERRORISMO</option>
              <option>TITULADO Y GRADUADO</option>
              <option>PERSONA CON DISCAPACIDAD</option>
              <option>DEPORTISTA DESTACADO</option>
              <option>1 Y 2 PUESTO</option>
            </select>
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Tipo de colegio</p>
          <div className="flex flex-wrap gap-3">
            {colegioOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setSelectedColegio(option)}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  selectedColegio === option
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Adjuntar pago</p>
              <p className="text-2xl font-semibold text-slate-900">S/. {montoRequerido.toFixed(2)}</p>
            </div>
            <button
              type="button"
              onClick={onOpenPayment}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-700"
            >
              Validar pago
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500">{paymentValidated ? 'Pago validado' : 'Pago pendiente'}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          Completa los datos iniciales y continúa a la ficha de postulación.
        </p>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700"
        >
          Ir a la ficha
        </button>
      </div>
    </section>
  )
}
