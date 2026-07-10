/**
 * api.ts — Cliente HTTP centralizado para el backend FastAPI.
 * Maneja autenticación JWT automáticamente.
 */

const BASE_URL = 'http://localhost:8000'

const TOKEN_KEY = 'unica_admin_token'

// ─── Helpers de token ─────────────────────────────────────────────────────────

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// ─── Request helper ───────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (requireAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  // 204 No Content no tiene body
  if (response.status === 204) return undefined as T

  return response.json()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  access_token: string
  token_type: string
  admin_username: string
  admin_nombre: string | null
}

export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// ─── Postulantes ──────────────────────────────────────────────────────────────

export interface PostulanteRegistroPayload {
  nombres: string
  apellido_paterno: string
  apellido_materno?: string
  tipo_documento: string
  nro_documento: string
  fecha_nacimiento?: string
  sexo?: string
  estado_civil?: string
  numero_hijos?: string
  foto?: string
  procedencia?: string
  pais_nacimiento?: string
  departamento_nacimiento?: string
  provincia_nacimiento?: string
  distrito_nacimiento?: string
  departamento_domicilio?: string
  provincia_domicilio?: string
  distrito_domicilio?: string
  direccion?: string
  correo?: string
  telefono1?: string
  telefono2?: string
  trabaja: boolean
  ocupacion?: string
  condicion_laboral?: string
  institucion_empresa?: string
  proceso?: string
  modalidad?: string
  area_academica?: string
  escuela_profesional?: string
  programa_academico?: string
  tipo_educacion?: string
  educacion_extranjero_esp?: string
  estudios_concluidos?: string
  departamento_estudio?: string
  provincia_estudio?: string
  institucion_educativa?: string
  periodo_inicio?: string
  periodo_fin?: string
  discapacidad?: string
  discapacidad_detalle?: string
  preparacion_universitaria?: string
  medio_difusion?: string
  medio_difusion_especifico?: string
  acepta_terminos: boolean
  // Familiar embebido
  familiar_tipo?: string
  familiar_nombre?: string
  familiar_relacion?: string
  familiar_ocupacion?: string
  familiar_centro?: string
  familiar_telefono?: string
  familiar_correo?: string
}

export interface PostulanteResponse {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno?: string
  nro_documento: string
  correo?: string
  escuela_profesional?: string
  pago_validado: boolean
  estado_registro: string
}

export async function registrarPostulante(data: PostulanteRegistroPayload): Promise<PostulanteResponse> {
  return request<PostulanteResponse>('/postulantes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ─── Admin — Lista de postulantes ─────────────────────────────────────────────

export interface StudentListItem {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno?: string
  nro_documento: string
  correo?: string
  telefono1?: string
  escuela_profesional?: string
  pago_validado: boolean
  estado_registro: string
  created_at: string
}

export async function fetchPostulantes(params?: {
  search?: string
  estado_registro?: string
  pago_validado?: boolean
  escuela_profesional?: string
}): Promise<StudentListItem[]> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.estado_registro) query.set('estado_registro', params.estado_registro)
  if (params?.pago_validado !== undefined) query.set('pago_validado', String(params.pago_validado))
  if (params?.escuela_profesional) query.set('escuela_profesional', params.escuela_profesional)

  const qs = query.toString() ? `?${query.toString()}` : ''
  return request<StudentListItem[]>(`/admin/postulantes${qs}`, {}, true)
}

export async function fetchPostulanteDetalle(id: number): Promise<PostulanteResponse> {
  return request<PostulanteResponse>(`/admin/postulantes/${id}`, {}, true)
}

export async function validarPagoAdmin(postulanteId: number): Promise<PostulanteResponse> {
  return request<PostulanteResponse>(
    `/admin/postulantes/${postulanteId}/validar-pago`,
    { method: 'PATCH' },
    true
  )
}

// ─── Pagos ────────────────────────────────────────────────────────────────────

export interface PagoPayload {
  postulante_id: number
  tipo: string
  nro_operacion: string
  monto: number
  fecha_pago?: string
}

export interface PagoResponse {
  id: number
  postulante_id: number
  tipo: string
  nro_operacion: string
  monto: number
  fecha_pago?: string
  validado: boolean
}

export async function registrarPago(data: PagoPayload): Promise<PagoResponse> {
  return request<PagoResponse>('/pagos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function eliminarPago(pagoId: number): Promise<void> {
  return request<void>(`/pagos/${pagoId}`, { method: 'DELETE' })
}

// ─── Documentos ───────────────────────────────────────────────────────────────

export async function subirDocumento(
  postulanteId: number,
  tipoDocumento: string,
  file: File
): Promise<{ id: number; tipo_documento: string; nombre_archivo: string }> {
  const formData = new FormData()
  formData.append('postulante_id', String(postulanteId))
  formData.append('tipo_documento', tipoDocumento)
  formData.append('file', file)

  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/documentos/upload`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error al subir archivo' }))
    throw new Error(error.detail || 'Error al subir archivo')
  }

  return response.json()
}
