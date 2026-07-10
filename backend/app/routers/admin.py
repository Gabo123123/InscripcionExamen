from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.postulante import PostulanteOut, PostulanteListItem
from app.services import postulante_service
from app.utils.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["Administración"], dependencies=[Depends(get_current_admin)])


@router.get(
    "/postulantes",
    response_model=List[PostulanteListItem],
    summary="Listar todos los postulantes (requiere JWT)",
)
def listar_postulantes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = Query(None, description="Buscar por nombre, DNI o correo"),
    estado_registro: Optional[str] = Query(None, description="Filtrar por estado: Pendiente / Completo"),
    pago_validado: Optional[bool] = Query(None, description="Filtrar por pago validado"),
    escuela_profesional: Optional[str] = Query(None, description="Filtrar por escuela profesional"),
    db: Session = Depends(get_db),
):
    """
    Retorna la lista de postulantes con filtros opcionales.
    Requiere autenticación JWT de administrador.
    """
    return postulante_service.listar_postulantes(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        estado_registro=estado_registro,
        pago_validado=pago_validado,
        escuela_profesional=escuela_profesional,
    )


@router.get(
    "/postulantes/{postulante_id}",
    response_model=PostulanteOut,
    summary="Ver detalle completo de un postulante (requiere JWT)",
)
def ver_postulante_admin(postulante_id: int, db: Session = Depends(get_db)):
    """Retorna todos los datos del postulante incluyendo familiares, pagos y documentos."""
    return postulante_service.obtener_postulante_por_id(db, postulante_id)


@router.patch(
    "/postulantes/{postulante_id}/estado",
    response_model=PostulanteOut,
    summary="Cambiar estado de registro (requiere JWT)",
)
def cambiar_estado(
    postulante_id: int,
    estado: str = Query(..., description="Nuevo estado: Pendiente / Completo"),
    db: Session = Depends(get_db),
):
    """Cambia el estado de registro de un postulante."""
    return postulante_service.cambiar_estado_postulante(db, postulante_id, estado)


@router.patch(
    "/postulantes/{postulante_id}/validar-pago",
    response_model=PostulanteOut,
    summary="Validar pago de un postulante (requiere JWT)",
)
def validar_pago(postulante_id: int, db: Session = Depends(get_db)):
    """Marca el pago del postulante como validado y su estado como Completo."""
    return postulante_service.validar_pago_postulante(db, postulante_id)
