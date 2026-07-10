import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import settings

# Tipos MIME permitidos
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def ensure_uploads_dir(subdir: str = "") -> Path:
    """Crea el directorio de uploads si no existe."""
    base = Path(settings.uploads_dir)
    target = base / subdir if subdir else base
    target.mkdir(parents=True, exist_ok=True)
    return target


async def save_upload_file(
    file: UploadFile,
    postulante_id: int,
    tipo_documento: str,
) -> tuple[str, str]:
    """
    Guarda un archivo subido al servidor.
    Retorna (nombre_archivo_guardado, ruta_relativa).
    """
    # Validar tipo de contenido
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido: {file.content_type}. Use PDF, JPG o PNG.",
        )

    # Leer contenido y validar tamaño
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"El archivo excede el límite de {MAX_FILE_SIZE_MB}MB.",
        )

    # Generar nombre único para evitar colisiones
    extension = Path(file.filename).suffix.lower()
    unique_name = f"{postulante_id}_{tipo_documento}_{uuid.uuid4().hex[:8]}{extension}"

    # Directorio por postulante
    subdir = f"postulante_{postulante_id}"
    target_dir = ensure_uploads_dir(subdir)
    file_path = target_dir / unique_name

    # Escribir archivo de forma asíncrona
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    ruta_relativa = f"{subdir}/{unique_name}"
    return unique_name, ruta_relativa


def get_file_path(ruta_relativa: str) -> Path:
    """Retorna la ruta absoluta de un archivo."""
    return Path(settings.uploads_dir) / ruta_relativa
