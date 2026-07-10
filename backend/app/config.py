from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Base de datos
    database_url: str = "postgresql://postgres:adminUTP@localhost:5432/inscripcion_admin"

    # JWT
    secret_key: str = "super_secret_key_inscripcion_unica_2026_backend"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    # Archivos
    uploads_dir: str = "./uploads"

    # CORS
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
