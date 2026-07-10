from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Boolean, DateTime, Integer, Text, Enum as SAEnum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum

if TYPE_CHECKING:
    from app.models.familiar import Familiar
    from app.models.pago import Pago
    from app.models.documento import Documento


class EstadoRegistro(str, enum.Enum):
    PENDIENTE = "Pendiente"
    COMPLETO = "Completo"


class Postulante(Base):
    """
    Entidad principal del sistema. Almacena todos los datos del postulante.
    Equivalente a @Entity Postulante en Hibernate con @OneToMany relationships.
    """
    __tablename__ = "postulantes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # === DATOS PERSONALES ===
    nombres: Mapped[str] = mapped_column(String(200), nullable=False)
    apellido_paterno: Mapped[str] = mapped_column(String(100), nullable=False)
    apellido_materno: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    tipo_documento: Mapped[str] = mapped_column(String(50), nullable=False, default="DNI")
    nro_documento: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    fecha_nacimiento: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    sexo: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="No especifica")
    estado_civil: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="Soltero")
    numero_hijos: Mapped[Optional[str]] = mapped_column(String(5), nullable=True, default="0")

    # === PROCEDENCIA Y NACIMIENTO ===
    foto: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    procedencia: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Perú")
    pais_nacimiento: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    departamento_nacimiento: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    provincia_nacimiento: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    distrito_nacimiento: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # === DOMICILIO ===
    departamento_domicilio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    provincia_domicilio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    distrito_domicilio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    direccion: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)

    # === CONTACTO ===
    correo: Mapped[Optional[str]] = mapped_column(String(200), nullable=True, index=True)
    telefono1: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    telefono2: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    # === OCUPACIÓN ===
    trabaja: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ocupacion: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    condicion_laboral: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    institucion_empresa: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # === PROCESO DE ADMISIÓN ===
    proceso: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    modalidad: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    area_academica: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    escuela_profesional: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    programa_academico: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # === EDUCACIÓN SECUNDARIA ===
    tipo_educacion: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Público")
    educacion_extranjero_esp: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    estudios_concluidos: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Sí")
    departamento_estudio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    provincia_estudio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    institucion_educativa: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    periodo_inicio: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    periodo_fin: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    # === INFORMACIÓN ADICIONAL ===
    discapacidad: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Ninguna")
    discapacidad_detalle: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    preparacion_universitaria: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    medio_difusion: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    medio_difusion_especifico: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # === ESTADO ===
    acepta_terminos: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    pago_validado: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    estado_registro: Mapped[str] = mapped_column(
        String(20), default=EstadoRegistro.PENDIENTE.value, nullable=False
    )

    # === TIMESTAMPS ===
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # === RELACIONES (equivalente @OneToMany de Hibernate) ===
    familiares: Mapped[List["Familiar"]] = relationship(
        "Familiar", back_populates="postulante", cascade="all, delete-orphan"
    )
    pagos: Mapped[List["Pago"]] = relationship(
        "Pago", back_populates="postulante", cascade="all, delete-orphan"
    )
    documentos: Mapped[List["Documento"]] = relationship(
        "Documento", back_populates="postulante", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Postulante id={self.id} dni={self.nro_documento} nombre={self.nombres}>"
