from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.documento import Documento
from app.utils.file_handler import save_upload_file, get_file_path
from app.utils.security import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/documentos", tags=["Documentos"])


class DocumentoOut(BaseModel):
    id: int
    postulante_id: int
    tipo_documento: str
    nombre_archivo: str
    model_config = {"from_attributes": True}


@router.post(
    "/upload",
    response_model=DocumentoOut,
    status_code=status.HTTP_201_CREATED,
    summary="Subir un documento del postulante",
)
async def subir_documento(
    postulante_id: int = Form(...),
    tipo_documento: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Sube un archivo (PDF/imagen) y lo asocia a un postulante.
    tipo_documento puede ser: DNI, certificado_estudios, compromiso_estudios,
    declaracion_antecedentes, declaracion_veracidad
    """
    nombre_archivo, ruta = await save_upload_file(file, postulante_id, tipo_documento)

    # Eliminar documento anterior del mismo tipo si existe
    doc_anterior = db.query(Documento).filter(
        Documento.postulante_id == postulante_id,
        Documento.tipo_documento == tipo_documento,
    ).first()
    if doc_anterior:
        db.delete(doc_anterior)

    documento = Documento(
        postulante_id=postulante_id,
        tipo_documento=tipo_documento,
        nombre_archivo=nombre_archivo,
        ruta_archivo=ruta,
        content_type=file.content_type,
    )
    db.add(documento)
    db.commit()
    db.refresh(documento)
    return documento


@router.get(
    "/{documento_id}",
    summary="Descargar un documento (requiere JWT)",
)
def descargar_documento(
    documento_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    """Permite al admin descargar un documento de un postulante."""
    doc = db.query(Documento).filter(Documento.id == documento_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documento no encontrado")

    file_path = get_file_path(doc.ruta_archivo)
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Archivo no encontrado en disco")

    return FileResponse(
        path=str(file_path),
        filename=doc.nombre_archivo,
        media_type=doc.content_type or "application/octet-stream",
    )
