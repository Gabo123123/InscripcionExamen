import { useMemo, useState, useEffect } from 'react'
import RegistrationForm from './components/RegistrationForm'
import ApplicationForm from './components/ApplicationForm'
import PaymentModal from './components/PaymentModal'
import AdminDashboard from './components/AdminDashboard'
import LoginModal from './components/LoginModal'

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
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
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

  // Detectar parámetro ?admin=true en la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setShowLoginModal(true)
    }
  }, [])

  // Validar credenciales de login
  const handleLogin = (username: string, password: string) => {
    setIsLoggingIn(true)
    setLoginError('')

    // Simular verificación (reemplaza con tu API real)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        setIsAdmin(true)
        setShowLoginModal(false)
        setLoginError('')
      } else {
        setLoginError('Usuario o contraseña incorrectos')
      }
      setIsLoggingIn(false)
    }, 500)
  }

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
    <>
      {isAdmin ? (
        <AdminDashboard 
          onLogout={() => {
            setIsAdmin(false)
            window.history.replaceState({}, '', window.location.pathname)
          }} 
        />
      ) : (
        <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

       <header className="mb-8 rounded-3xl bg-white/90 px-5 md:px-6 py-5 shadow-lg shadow-slate-200/70 backdrop-blur-sm ring-1 ring-slate-200">
  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    
    {/* 1. Izquierda: Logo y Títulos (Optimizando espacios y pesos visuales) */}
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md shadow-emerald-500/20">
        <img 
          src="https://www.unica.edu.pe/transparencia/img/unica.png" 
          alt="Logo UNICA" 
          className="h-full w-full object-contain p-1"
        />
      </div>
      <div>
        <p className="mb-0.5 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Universidad Nacional
        </p>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">
          Registro de Postulante
        </h1>
      </div>
    </div>

    {/* 2. Derecha: Agrupación de Etiqueta + Acciones Administrativas */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      
      {/* Etiqueta del proceso con un poco más de sutileza */}
      <div className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/50">
        Proceso 2026-1 Ordinario
      </div>
      
      {/* 3. Botón Admin: Estilo 'Ghost' con icono de candado, se camufla con el entorno */}
      <button
        onClick={() => setShowLoginModal(true)}
        className="group flex items-center gap-2 rounded-xl bg-transparent px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
        title="Acceso Administrativo"
      >
        <svg 
          className="h-5 w-5 transition-transform group-hover:scale-110" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="hidden sm:inline-block">Admin</span>
      </button>

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
      )}

      <LoginModal
        visible={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          setLoginError('')
          window.history.replaceState({}, '', window.location.pathname)
        }}
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        error={loginError}
      />
    </>
  )
}

export default App