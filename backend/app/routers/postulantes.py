from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.postulante import PostulanteCreate, PostulanteOut
from app.services import postulante_service

router = APIRouter(prefix="/postulantes", tags=["Postulantes"])


@router.post(
    "",
    response_model=PostulanteOut,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar nuevo postulante",
)
def registrar_postulante(data: PostulanteCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo postulante con toda su información personal, educativa
    y de familiar/apoderado. Retorna el postulante creado con su ID.
    """
    return postulante_service.crear_postulante(db, data)


@router.get(
    "/{postulante_id}",
    response_model=PostulanteOut,
    summary="Ver datos de un postulante por ID",
)
def ver_postulante(postulante_id: int, db: Session = Depends(get_db)):
    """Obtiene el detalle completo de un postulante por su ID."""
    return postulante_service.obtener_postulante_por_id(db, postulante_id)


@router.get(
    "/documento/{nro_documento}",
    response_model=PostulanteOut,
    summary="Buscar postulante por número de documento",
)
def buscar_por_documento(nro_documento: str, db: Session = Depends(get_db)):
    """Busca un postulante por su número de DNI o documento de identidad."""
    return postulante_service.obtener_postulante_por_documento(db, nro_documento)
