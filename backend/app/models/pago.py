from datetime import datetime, date
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Integer, ForeignKey, Boolean, Numeric, Date, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import decimal

if TYPE_CHECKING:
    from app.models.postulante import Postulante


class Pago(Base):
    """
    Registro de pagos realizados por el postulante.
    Relación @ManyToOne con Postulante.
    """
    __tablename__ = "pagos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    postulante_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("postulantes.id", ondelete="CASCADE"), nullable=False, index=True
    )

    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    nro_operacion: Mapped[str] = mapped_column(String(100), nullable=False)
    monto: Mapped[decimal.Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    fecha_pago: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    validado: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relación inversa
    postulante: Mapped["Postulante"] = relationship("Postulante", back_populates="pagos")

    def __repr__(self) -> str:
        return f"<Pago id={self.id} operacion={self.nro_operacion} monto={self.monto}>"
