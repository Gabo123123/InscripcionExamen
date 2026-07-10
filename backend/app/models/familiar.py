from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.postulante import Postulante


class Familiar(Base):
    """
    Datos del familiar o apoderado del postulante.
    Relación @ManyToOne con Postulante (un postulante puede tener varios familiares).
    """
    __tablename__ = "familiares"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    postulante_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("postulantes.id", ondelete="CASCADE"), nullable=False, index=True
    )

    tipo_familiar: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Ninguno")
    nombre: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    relacion: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ocupacion: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    centro_laboral: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    telefono: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    correo: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # Relación inversa - equivalente @ManyToOne
    postulante: Mapped["Postulante"] = relationship("Postulante", back_populates="familiares")

    def __repr__(self) -> str:
        return f"<Familiar id={self.id} tipo={self.tipo_familiar} nombre={self.nombre}>"
