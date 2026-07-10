from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.admin import Admin
from app.utils.security import verify_password, create_access_token


def authenticate_admin(db: Session, username: str, password: str) -> Admin:
    """
    Autentica un administrador verificando credenciales.
    Equivalente a UserDetailsService.loadUserByUsername + AuthenticationManager de Spring.
    """
    admin = db.query(Admin).filter(Admin.username == username).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    if not verify_password(password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    return admin


def generate_token_for_admin(admin: Admin) -> str:
    """Genera el JWT para el admin autenticado."""
    return create_access_token(
        data={"sub": admin.username, "admin_id": admin.id}
    )
