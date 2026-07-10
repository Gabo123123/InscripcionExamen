from typing import Optional
from pydantic import BaseModel
import decimal


class PagoCreate(BaseModel):
    postulante_id: int
    tipo: str
    nro_operacion: str
    monto: decimal.Decimal
    fecha_pago: Optional[str] = None


class PagoOut(BaseModel):
    id: int
    postulante_id: int
    tipo: str
    nro_operacion: str
    monto: decimal.Decimal
    fecha_pago: Optional[str] = None
    validado: bool

    model_config = {"from_attributes": True}
