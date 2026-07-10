from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.pago import PagoCreate, PagoOut
from app.models.pago import Pago
from app.models.postulante import Postulante
from app.utils.security import get_current_admin

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.post(
    "",
    response_model=PagoOut,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un pago",
)
def registrar_pago(data: PagoCreate, db: Session = Depends(get_db)):
    """Agrega un registro de pago a un postulante."""
    # Verificar que el postulante existe
    postulante = db.query(Postulante).filter(Postulante.id == data.postulante_id).first()
    if not postulante:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Postulante con id {data.postulante_id} no encontrado",
        )

    pago = Pago(
        postulante_id=data.postulante_id,
        tipo=data.tipo,
        nro_operacion=data.nro_operacion,
        monto=data.monto,
        fecha_pago=data.fecha_pago,
        validado=False,
    )
    db.add(pago)
    db.commit()
    db.refresh(pago)
    return pago


@router.delete(
    "/{pago_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar un pago",
)
def eliminar_pago(pago_id: int, db: Session = Depends(get_db)):
    """Elimina un registro de pago."""
    pago = db.query(Pago).filter(Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pago no encontrado")
    db.delete(pago)
    db.commit()


@router.patch(
    "/{pago_id}/validar",
    response_model=PagoOut,
    summary="Validar un pago (requiere JWT)",
)
def validar_pago(
    pago_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Admin marca el pago como validado."""
    pago = db.query(Pago).filter(Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pago no encontrado")
    pago.validado = True
    # Actualizar también el postulante
    postulante = db.query(Postulante).filter(Postulante.id == pago.postulante_id).first()
    if postulante:
        postulante.pago_validado = True
    db.commit()
    db.refresh(pago)
    return pago
