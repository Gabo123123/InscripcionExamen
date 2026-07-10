from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse, AdminInfo
from app.services.auth_service import authenticate_admin, generate_token_for_admin
from app.utils.security import get_current_admin
from app.models.admin import Admin

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", response_model=TokenResponse, summary="Login de administrador")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Autentica al administrador y retorna un JWT de acceso.
    Credenciales por defecto: admin / admin123
    """
    admin = authenticate_admin(db, request.username, request.password)
    token = generate_token_for_admin(admin)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        admin_username=admin.username,
        admin_nombre=admin.nombre_completo,
    )


@router.get("/me", response_model=AdminInfo, summary="Info del admin autenticado")
def me(
    current: dict = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Retorna los datos del administrador actualmente autenticado."""
    admin = db.query(Admin).filter(Admin.username == current["username"]).first()
    if not admin:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin no encontrado")
    return admin
