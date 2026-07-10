from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config import settings

# Motor de base de datos - equivalente al EntityManagerFactory de Hibernate
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,       # Reconexión automática
    pool_size=10,             # Pool de conexiones
    max_overflow=20,
    echo=False,               # Cambiar a True para ver SQL en consola
)

# Session factory - equivalente al SessionFactory de Hibernate
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base declarativa para todos los modelos ORM
class Base(DeclarativeBase):
    pass


# Dependencia de FastAPI para obtener sesión por request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
