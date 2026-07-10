from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import engine, Base
import app.models  # noqa: F401 - registra todos los modelos en SQLAlchemy

from app.routers import auth, postulantes, pagos, documentos, admin

# ─── Crear tablas en BD al iniciar ───────────────────────────────────────────
# Equivalente a hibernate.hbm2ddl.auto=update
Base.metadata.create_all(bind=engine)

# ─── Crear directorio de uploads si no existe ────────────────────────────────
Path(settings.uploads_dir).mkdir(parents=True, exist_ok=True)

# ─── Aplicación FastAPI ───────────────────────────────────────────────────────
app = FastAPI(
    title="Sistema de Inscripción - UNICA",
    description="""
## API REST — Sistema de Inscripción para Examen de Admisión
**Universidad Nacional San Luis Gonzaga de Ica**

### Módulos
- 🔐 **Autenticación**: Login de administradores con JWT
- 👤 **Postulantes**: Registro y consulta de postulantes
- 💳 **Pagos**: Gestión de pagos de inscripción
- 📄 **Documentos**: Subida de archivos (PDF/imágenes)
- 🛡️ **Admin**: Panel de administración protegido

### Autenticación
Para las rutas protegidas, usa el botón **Authorize** con el JWT obtenido del endpoint `/auth/login`.
    """,
    version="1.0.0",
    contact={
        "name": "CECA - UNICA",
        "email": "admision@unica.edu.pe",
    },
)

# ─── CORS — Permitir al frontend React conectarse ─────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,      # http://localhost:5173
        "http://localhost:5174",    # Puerto alternativo de Vite
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Registrar todos los routers ─────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(postulantes.router)
app.include_router(pagos.router)
app.include_router(documentos.router)
app.include_router(admin.router)


# ─── Health check ────────────────────────────────────────────────────────────
@app.get("/health", tags=["Sistema"])
def health_check():
    """Verifica que el servidor está corriendo."""
    return {
        "status": "ok",
        "sistema": "Sistema de Inscripción UNICA",
        "version": "1.0.0",
    }


@app.get("/", tags=["Sistema"])
def root():
    return {
        "mensaje": "API Sistema de Inscripción UNICA - v1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }
