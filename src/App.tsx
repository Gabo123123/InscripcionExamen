import { useMemo, useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import ApplicationForm from './components/ApplicationForm'
import PaymentModal from './components/PaymentModal'

export type FormData = {
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  tipoDocumento: string
  nroDocumento: string
  fechaNacimiento: string
  sexo: string
  procedencia: string
  paisNacimiento: string
  departamentoNacimiento: string
  provinciaNacimiento: string
  distritoNacimiento: string
  departamentoDomicilio: string
  provinciaDomicilio: string
  distritoDomicilio: string
  direccion: string
  correo: string
  telefono1: string
  telefono2: string
  trabaja: boolean
  ocupacion: string
  condicionLaboral: string
  institucionEmpresa: string
  familiarTipo: string
  familiarNombre: string
  familiarRelacion: string
  familiarOcupacion: string
  familiarCentro: string
  familiarTelefono: string
  familiarCorreo: string
  numeroHijos: string
  tipoEducacion: string
  estudiosConcluidos: string
  departamentoEstudio: string
  provinciaEstudio: string
  institucionEducativa: string
  periodoInicio: string
  periodoFin: string
  discapacidad: string
  discapacidadDetalle: string
  preparacionUniversitaria: string
  medioDifusion: string
  areaAcademica: string
  escuelaProfesional: string
  programaAcademico: string
  docIdentidad: string
  certificadoEstudios: string
  compromisoEstudios: string
  declaracionAntecedentes: string
  declaracionVeracidad: string
  aceptaTerminos: boolean
  proceso: string
  modalidad: string
  estadoCivil: string
  pagoValidado: boolean
}

type PaymentItem = {
  tipo: string
  operacion: string
  monto: string
  fecha: string
}

const pagoOptions = ['Entidad Financiera (Banco/Caja)', 'Depósito en efectivo', 'Transferencia']

const initialForm: FormData = {
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  tipoDocumento: 'DNI',
  nroDocumento: '',
  fechaNacimiento: '',
  sexo: 'No especifica',
  procedencia: 'Perú',
  paisNacimiento: 'Perú',
  departamentoNacimiento: 'Amazonas',
  provinciaNacimiento: 'Bagua',
  distritoNacimiento: 'Aramango',
  departamentoDomicilio: 'Amazonas',
  provinciaDomicilio: 'Bagua',
  distritoDomicilio: 'Aramango',
  direccion: '',
  correo: '',
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
  departamentoEstudio: 'Amazonas',
  provinciaEstudio: 'Bagua',
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
  pagoValidado: false,
}

function App() {
  const [step, setStep] = useState<'registro' | 'ficha' | 'success'>('registro')
  const [selectedColegio, setSelectedColegio] = useState('Público')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [newPayment, setNewPayment] = useState<PaymentItem>({
    tipo: pagoOptions[0],
    operacion: '',
    monto: '',
    fecha: '',
  })
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [form, setForm] = useState<FormData>(initialForm)

  const paymentTotal = useMemo(() => payments.reduce((sum, item) => sum + Number(item.monto || 0), 0), [payments])

  const edad = useMemo(() => {
    if (!form.fechaNacimiento) return ''
    const birth = new Date(form.fechaNacimiento)
    const diff = Date.now() - birth.getTime()
    const age = new Date(diff).getUTCFullYear() - 1970
    return age > 0 ? String(age) : '0'
  }, [form.fechaNacimiento])

  const handleInput = (key: keyof FormData, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const addPayment = () => {
    if (!newPayment.operacion || !newPayment.monto || !newPayment.fecha) return
    setPayments((current) => [...current, newPayment])
    setNewPayment({ tipo: pagoOptions[0], operacion: '', monto: '', fecha: '' })
  }

  const removePayment = (index: number) => {
    setPayments((current) => current.filter((_, idx) => idx !== index))
  }

  const markPaymentValid = () => {
    setForm((current) => ({ ...current, pagoValidado: true }))
    setShowPaymentModal(false)
  }

  const finishRegistration = () => {
    if (!form.aceptaTerminos) return
    setStep('success')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-white/90 px-5 py-5 shadow-lg shadow-slate-200/70 backdrop-blur-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                <span className="text-lg font-semibold">UNICA</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Universidad Nacional</p>
                <h1 className="text-2xl font-semibold text-slate-900">Registro de Postulante</h1>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
              Proceso de Admisión 2026-1 Ordinario
            </div>
          </div>
        </header>

        {step === 'registro' && (
          <RegistrationForm
            form={form}
            onChange={handleInput}
            onContinue={() => setStep('ficha')}
            selectedColegio={selectedColegio}
            setSelectedColegio={setSelectedColegio}
            onOpenPayment={() => setShowPaymentModal(true)}
            paymentValidated={form.pagoValidado}
          />
        )}

        {step === 'ficha' && (
          <ApplicationForm
            form={form}
            edad={edad}
            onChange={handleInput}
            onBack={() => setStep('registro')}
            onSubmit={finishRegistration}
          />
        )}

        {step === 'success' && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
            <h2 className="text-3xl font-semibold text-slate-900">Inscripción enviada</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              El postulante debe acercarse a la Oficina de la Comisión Ejecutiva Central de Admisión (CECA), ubicada en Calle Las Palmeras 187 - Urb. San José, Ica, para finalizar su inscripción con la toma de foto y huella dactilar.
            </p>
            <button
              type="button"
              onClick={() => setStep('registro')}
              className="mt-8 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Aceptar
            </button>
          </div>
        )}
      </div>

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        payments={payments}
        addPayment={addPayment}
        paymentTotal={paymentTotal}
        onValidatePayment={markPaymentValid}
        onRemovePayment={removePayment}
      />
    </div>
  )
}

export default App
