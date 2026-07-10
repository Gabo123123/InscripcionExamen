import { useMemo, useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Toaster, toast } from 'react-hot-toast'
import RegistrationForm from './components/RegistrationForm'
import ApplicationForm from './components/ApplicationForm'
import PaymentModal from './components/PaymentModal'
import AdminDashboard from './components/AdminDashboard'
import LoginModal from './components/LoginModal'
import CarnetPDF from './components/CarnetPDF'
import { loginAdmin, registrarPostulante, saveToken, removeToken, type PostulanteRegistroPayload } from './api'
import logoUnica from './assets/logo-unica.png'

export type FormData = {
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  tipoDocumento: string
  nroDocumento: string
  fechaNacimiento: string
  sexo: string
  estadoCivil: string
  numeroHijos: string
  foto: string
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
  educacionExtranjeroEsp: string
  medioDifusionEspecifico: string
  proceso: string
  modalidad: string
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
  estadoCivil: 'Soltero',
  numeroHijos: '0',
  foto: '',
  procedencia: '',
  paisNacimiento: '',
  departamentoNacimiento: '',
  provinciaNacimiento: '',
  distritoNacimiento: '',
  departamentoDomicilio: '',
  provinciaDomicilio: '',
  distritoDomicilio: '',
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
  tipoEducacion: 'Nacional',
  estudiosConcluidos: 'Sí',
  departamentoEstudio: '',
  provinciaEstudio: '',
  institucionEducativa: '',
  periodoInicio: '2020',
  periodoFin: '2024',
  discapacidad: 'Ninguna',
  discapacidadDetalle: '',
  preparacionUniversitaria: '',
  medioDifusion: 'Internet',
  medioDifusionEspecifico: '',
  areaAcademica: '',
  escuelaProfesional: '',
  programaAcademico: '',
  docIdentidad: '',
  certificadoEstudios: '',
  compromisoEstudios: '',
  declaracionAntecedentes: '',
  declaracionVeracidad: '',
  aceptaTerminos: false,
  educacionExtranjeroEsp: '',
  proceso: '2026-2- PROCESO DE ADMISION 2026-1 ORDINARIO, VICTIMAS DE TERRORISMO',
  modalidad: 'ORDINARIO, VICTIMAS DE TERRORISMO',
  pagoValidado: false,
}

function App() {
  const [step, setStep] = useState<'registro' | 'ficha' | 'success'>('registro')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [_registeredPostulanteId, setRegisteredPostulanteId] = useState<number | null>(null)
  const [selectedColegio, setSelectedColegio] = useState('Nacional')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [newPayment, setNewPayment] = useState<PaymentItem>({
    tipo: pagoOptions[0],
    operacion: '',
    monto: '',
    fecha: '',
  })
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [form, setForm] = useState<FormData>(initialForm)

  const montoRequerido = useMemo(() => {
    if (selectedColegio === 'Particular') return 550;
    if (selectedColegio === 'Víctimas de terrorismo') return 40;
    return 400;
  }, [selectedColegio]);

  const paymentTotal = useMemo(() => payments.reduce((sum, item) => sum + Number(item.monto || 0), 0), [payments])
  const paymentValidated = paymentTotal >= montoRequerido

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setShowLoginModal(true)
    }
  }, [])

  const handleLogin = async (username: string, password: string) => {
    setIsLoggingIn(true)
    setLoginError('')
    try {
      const response = await loginAdmin(username, password)
      saveToken(response.access_token)
      setIsAdmin(true)
      setShowLoginModal(false)
      setLoginError('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error de conexión con el servidor'
      setLoginError(msg)
    } finally {
      setIsLoggingIn(false)
    }
  }

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
    toast.success('Pago validado exitosamente', {
      duration: 4000,
      position: 'top-center'
    })
  }

  const finishRegistration = async () => {
    if (!form.aceptaTerminos || !paymentValidated) {
      toast.error('Debe aceptar los términos y validar el pago para continuar.', { position: 'top-center' })
      return
    }

    const requiredFields = [
      form.nombres, form.apellidoPaterno, form.nroDocumento, 
      form.fechaNacimiento, form.foto, form.departamentoDomicilio, form.areaAcademica, form.escuelaProfesional
    ]
    if (requiredFields.some(field => !field)) {
      toast.error('Por favor complete todos los campos obligatorios antes de continuar.', { position: 'top-center' })
      return
    }

    setIsSubmitting(true)
    try {
      const payload: PostulanteRegistroPayload = {
        nombres: form.nombres,
        apellido_paterno: form.apellidoPaterno,
        apellido_materno: form.apellidoMaterno || undefined,
        tipo_documento: form.tipoDocumento,
        nro_documento: form.nroDocumento,
        fecha_nacimiento: form.fechaNacimiento || undefined,
        sexo: form.sexo,
        estado_civil: form.estadoCivil,
        numero_hijos: form.numeroHijos,
        foto: form.foto || undefined,
        procedencia: form.procedencia,
        pais_nacimiento: form.paisNacimiento || undefined,
        departamento_nacimiento: form.departamentoNacimiento || undefined,
        provincia_nacimiento: form.provinciaNacimiento || undefined,
        distrito_nacimiento: form.distritoNacimiento || undefined,
        departamento_domicilio: form.departamentoDomicilio || undefined,
        provincia_domicilio: form.provinciaDomicilio || undefined,
        distrito_domicilio: form.distritoDomicilio || undefined,
        direccion: form.direccion || undefined,
        correo: form.correo || undefined,
        telefono1: form.telefono1 || undefined,
        telefono2: form.telefono2 || undefined,
        trabaja: form.trabaja,
        ocupacion: form.ocupacion || undefined,
        condicion_laboral: form.condicionLaboral || undefined,
        institucion_empresa: form.institucionEmpresa || undefined,
        proceso: form.proceso,
        modalidad: form.modalidad,
        area_academica: form.areaAcademica || undefined,
        escuela_profesional: form.escuelaProfesional || undefined,
        programa_academico: form.programaAcademico || undefined,
        tipo_educacion: form.tipoEducacion,
        educacion_extranjero_esp: form.educacionExtranjeroEsp || undefined,
        estudios_concluidos: form.estudiosConcluidos,
        departamento_estudio: form.departamentoEstudio || undefined,
        provincia_estudio: form.provinciaEstudio || undefined,
        institucion_educativa: form.institucionEducativa || undefined,
        periodo_inicio: form.periodoInicio || undefined,
        periodo_fin: form.periodoFin || undefined,
        discapacidad: form.discapacidad,
        discapacidad_detalle: form.discapacidadDetalle || undefined,
        preparacion_universitaria: form.preparacionUniversitaria || undefined,
        medio_difusion: form.medioDifusion,
        medio_difusion_especifico: form.medioDifusionEspecifico || undefined,
        acepta_terminos: form.aceptaTerminos,
        familiar_tipo: form.familiarTipo !== 'Ninguno' ? form.familiarTipo : undefined,
        familiar_nombre: form.familiarNombre || undefined,
        familiar_relacion: form.familiarRelacion || undefined,
        familiar_ocupacion: form.familiarOcupacion || undefined,
        familiar_centro: form.familiarCentro || undefined,
        familiar_telefono: form.familiarTelefono || undefined,
        familiar_correo: form.familiarCorreo || undefined,
      }
      const created = await registrarPostulante(payload)
      setRegisteredPostulanteId(created.id)
      setStep('success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar la inscripción'
      alert(`Error: ${msg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatePDF = async () => {
    const page1 = document.getElementById('carnet-page-1')
    const page2 = document.getElementById('carnet-page-2')
    if (!page1 || !page2) {
      toast.error('No se pudo encontrar el contenedor del PDF')
      return
    }

    const toastId = toast.loading('Generando PDF, por favor espere...')

    // Usamos setTimeout para permitir que el toast se renderice antes de bloquear el hilo
    setTimeout(async () => {
      try {
        const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true, logging: false })
        const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true, logging: false })

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
        
        doc.addImage(canvas1.toDataURL('image/png'), 'PNG', 0, 0, 297, 210)
        doc.addPage('a4', 'p')
        doc.addImage(canvas2.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)

        doc.save(`Carnet_Postulante_${form.nroDocumento || 'Prueba'}.pdf`)
        toast.success('¡PDF generado correctamente!', { id: toastId })
      } catch (error: any) {
        console.error('Error generando PDF:', error)
        toast.error(`Error al generar: ${error?.message || String(error)}`, { id: toastId, duration: 6000 })
      }
    }, 100)
  }

  return (
    <>
      {isAdmin ? (
        <AdminDashboard
          onLogout={() => {
            setIsAdmin(false)
            removeToken()
            window.history.replaceState({}, '', window.location.pathname)
          }}
        />
      ) : (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-emerald-500/30">
          <Toaster />
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            <header className="mb-8 rounded-3xl bg-white/90 px-5 md:px-6 py-5 shadow-lg shadow-slate-200/70 backdrop-blur-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md shadow-emerald-500/20">
                    <img
                      src={logoUnica}
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/50">
                    Proceso 2026-1 Ordinario
                  </div>
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
                paymentValidated={paymentValidated}
                montoRequerido={montoRequerido}
              />
            )}

            {step === 'ficha' && (
              <ApplicationForm
                form={form}
                edad={edad}
                onChange={handleInput}
                onBack={() => setStep('registro')}
                onSubmit={finishRegistration}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 'success' && (
              <div className="rounded-3xl bg-white p-10 text-center shadow-xl shadow-slate-300/30 ring-1 ring-slate-200">
                <h2 className="text-3xl font-semibold text-slate-900">Inscripción enviada</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  El postulante debe acercarse a la Oficina de la Comisión Ejecutiva Central de Admisión (CECA), ubicada en Calle Las Palmeras 187 - Urb. San José, Ica, para finalizar su inscripción con la toma de foto y huella dactilar.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Descargar carné
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('registro')}
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Aceptar
                  </button>
                </div>
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
            requiredTotal={montoRequerido}
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

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>
        <div>
          <CarnetPDF form={form.nombres && form.foto ? form : {
            ...form,
            nombres: 'JUAN',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nroDocumento: '12345678',
            fechaNacimiento: '1995-10-15',
            modalidad: 'ADMISIÓN ORDINARIA',
            escuelaProfesional: 'INGENIERÍA DE SISTEMAS',
            proceso: 'PROCESO DE ADMISIÓN 2026-1 ORDINARIO',
            foto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
          }} />
        </div>
      </div>

      {/* Botón flotante para probar PDF sin llenar datos */}
      {step !== 'success' && (
        <button
          onClick={generatePDF}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-800 transition"
        >
          📄 Probar PDF
        </button>
      )}
    </>
  )
}

export default App