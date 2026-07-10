from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
import decimal


# ─── Schemas de Pago embebidos ────────────────────────────────────────────────

class PagoBase(BaseModel):
    tipo: str
    nro_operacion: str
    monto: decimal.Decimal
    fecha_pago: Optional[str] = None


class PagoOut(PagoBase):
    id: int
    validado: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Schemas de Familiar embebidos ───────────────────────────────────────────

class FamiliarBase(BaseModel):
    tipo_familiar: Optional[str] = "Ninguno"
    nombre: Optional[str] = None
    relacion: Optional[str] = None
    ocupacion: Optional[str] = None
    centro_laboral: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None


class FamiliarOut(FamiliarBase):
    id: int
    model_config = {"from_attributes": True}


# ─── Schemas de Documento embebidos ──────────────────────────────────────────

class DocumentoOut(BaseModel):
    id: int
    tipo_documento: str
    nombre_archivo: str
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── Postulante CREATE (viene del frontend) ───────────────────────────────────

class PostulanteCreate(BaseModel):
    # Datos personales
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    tipo_documento: str = "DNI"
    nro_documento: str
    fecha_nacimiento: Optional[str] = None
    sexo: Optional[str] = "No especifica"
    estado_civil: Optional[str] = "Soltero"
    numero_hijos: Optional[str] = "0"

    # Procedencia y nacimiento
    foto: Optional[str] = None
    procedencia: Optional[str] = "Perú"
    pais_nacimiento: Optional[str] = None
    departamento_nacimiento: Optional[str] = None
    provincia_nacimiento: Optional[str] = None
    distrito_nacimiento: Optional[str] = None

    # Domicilio
    departamento_domicilio: Optional[str] = None
    provincia_domicilio: Optional[str] = None
    distrito_domicilio: Optional[str] = None
    direccion: Optional[str] = None

    # Contacto
    correo: Optional[str] = None
    telefono1: Optional[str] = None
    telefono2: Optional[str] = None

    # Ocupación
    trabaja: bool = False
    ocupacion: Optional[str] = None
    condicion_laboral: Optional[str] = None
    institucion_empresa: Optional[str] = None

    # Proceso
    proceso: Optional[str] = None
    modalidad: Optional[str] = None
    area_academica: Optional[str] = None
    escuela_profesional: Optional[str] = None
    programa_academico: Optional[str] = None

    # Educación
    tipo_educacion: Optional[str] = "Público"
    educacion_extranjero_esp: Optional[str] = None
    estudios_concluidos: Optional[str] = "Sí"
    departamento_estudio: Optional[str] = None
    provincia_estudio: Optional[str] = None
    institucion_educativa: Optional[str] = None
    periodo_inicio: Optional[str] = None
    periodo_fin: Optional[str] = None

    # Adicional
    discapacidad: Optional[str] = "Ninguna"
    discapacidad_detalle: Optional[str] = None
    preparacion_universitaria: Optional[str] = None
    medio_difusion: Optional[str] = None
    medio_difusion_especifico: Optional[str] = None

    # Estado
    acepta_terminos: bool = False

    # Familiar (opcional, embebido en el mismo request)
    familiar_tipo: Optional[str] = None
    familiar_nombre: Optional[str] = None
    familiar_relacion: Optional[str] = None
    familiar_ocupacion: Optional[str] = None
    familiar_centro: Optional[str] = None
    familiar_telefono: Optional[str] = None
    familiar_correo: Optional[str] = None


# ─── Postulante OUTPUT (respuesta de la API) ──────────────────────────────────

class PostulanteOut(BaseModel):
    id: int
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    tipo_documento: str
    nro_documento: str
    fecha_nacimiento: Optional[str] = None
    sexo: Optional[str] = None
    estado_civil: Optional[str] = None
    numero_hijos: Optional[str] = None
    foto: Optional[str] = None
    procedencia: Optional[str] = None
    pais_nacimiento: Optional[str] = None
    departamento_nacimiento: Optional[str] = None
    provincia_nacimiento: Optional[str] = None
    distrito_nacimiento: Optional[str] = None
    departamento_domicilio: Optional[str] = None
    provincia_domicilio: Optional[str] = None
    distrito_domicilio: Optional[str] = None
    direccion: Optional[str] = None
    correo: Optional[str] = None
    telefono1: Optional[str] = None
    telefono2: Optional[str] = None
    trabaja: bool = False
    ocupacion: Optional[str] = None
    condicion_laboral: Optional[str] = None
    institucion_empresa: Optional[str] = None
    proceso: Optional[str] = None
    modalidad: Optional[str] = None
    area_academica: Optional[str] = None
    escuela_profesional: Optional[str] = None
    programa_academico: Optional[str] = None
    tipo_educacion: Optional[str] = None
    educacion_extranjero_esp: Optional[str] = None
    estudios_concluidos: Optional[str] = None
    departamento_estudio: Optional[str] = None
    provincia_estudio: Optional[str] = None
    institucion_educativa: Optional[str] = None
    periodo_inicio: Optional[str] = None
    periodo_fin: Optional[str] = None
    discapacidad: Optional[str] = None
    discapacidad_detalle: Optional[str] = None
    preparacion_universitaria: Optional[str] = None
    medio_difusion: Optional[str] = None
    medio_difusion_especifico: Optional[str] = None
    acepta_terminos: bool = False
    pago_validado: bool = False
    estado_registro: str = "Pendiente"
    created_at: datetime
    updated_at: datetime

    familiares: List[FamiliarOut] = []
    pagos: List[PagoOut] = []
    documentos: List[DocumentoOut] = []

    model_config = {"from_attributes": True}


# ─── Lista de postulantes para el dashboard admin ─────────────────────────────

class PostulanteListItem(BaseModel):
    id: int
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    nro_documento: str
    correo: Optional[str] = None
    telefono1: Optional[str] = None
    escuela_profesional: Optional[str] = None
    pago_validado: bool = False
    estado_registro: str
    created_at: datetime

    model_config = {"from_attributes": True}
