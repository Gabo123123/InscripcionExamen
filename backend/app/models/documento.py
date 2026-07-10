from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum

if TYPE_CHECKING:
    from app.models.postulante import Postulante


class TipoDocumento(str, enum.Enum):
    DNI = "DNI"
    CERTIFICADO = "certificado_estudios"
    COMPROMISO = "compromiso_estudios"
    DECLARACION_ANTECEDENTES = "declaracion_antecedentes"
    DECLARACION_VERACIDAD = "declaracion_veracidad"


class Documento(Base):
    """
    Archivos subidos por el postulante (PDF, imágenes).
    Relación @ManyToOne con Postulante.
    """
    __tablename__ = "documentos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    postulante_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("postulantes.id", ondelete="CASCADE"), nullable=False, index=True
    )

    tipo_documento: Mapped[str] = mapped_column(String(100), nullable=False)
    nombre_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    ruta_archivo: Mapped[str] = mapped_column(String(500), nullable=False)
    content_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relación inversa
    postulante: Mapped["Postulante"] = relationship("Postulante", back_populates="documentos")

    def __repr__(self) -> str:
        return f"<Documento id={self.id} tipo={self.tipo_documento} archivo={self.nombre_archivo}>"
