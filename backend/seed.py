"""
seed.py — Datos iniciales del sistema de inscripción UNICA.

Crea:
- 1 administrador por defecto: admin / admin123
- 5 postulantes de ejemplo con pagos y familiares

Ejecutar con: python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from decimal import Decimal
from app.database import SessionLocal, engine, Base
import app.models  # noqa: F401 - necesario para registrar modelos

from app.models.admin import Admin
from app.models.postulante import Postulante
from app.models.familiar import Familiar
from app.models.pago import Pago
from app.utils.security import hash_password


def create_all_tables():
    """Crea todas las tablas si no existen."""
    print("[DB] Creando tablas en PostgreSQL...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Tablas creadas correctamente.")


def seed_admins(db):
    """Crea el administrador por defecto."""
    existing = db.query(Admin).filter(Admin.username == "admin").first()
    if existing:
        print("[SKIP] Admin 'admin' ya existe -- omitiendo.")
        return

    admin = Admin(
        username="admin",
        password_hash=hash_password("admin123"),
        nombre_completo="Administrador CECA",
    )
    db.add(admin)
    db.flush()
    print(f"[OK] Admin creado: admin / admin123  (id={admin.id})")


def seed_postulantes(db):
    """Crea postulantes de ejemplo basados en los datos del frontend."""
    datos = [
        {
            "nombres": "Hugo",
            "apellido_paterno": "Rojas",
            "apellido_materno": "García",
            "tipo_documento": "DNI",
            "nro_documento": "12345678",
            "fecha_nacimiento": "1995-03-15",
            "sexo": "Masculino",
            "estado_civil": "Soltero",
            "numero_hijos": "0",
            "procedencia": "Perú",
            "pais_nacimiento": "Perú",
            "departamento_nacimiento": "Ica",
            "provincia_nacimiento": "Ica",
            "distrito_nacimiento": "Ica",
            "departamento_domicilio": "Ica",
            "provincia_domicilio": "Ica",
            "distrito_domicilio": "Ica",
            "direccion": "Calle Las Palmeras 187, Urb. San José",
            "correo": "hugo.rojas@example.com",
            "telefono1": "956123456",
            "telefono2": "957654321",
            "trabaja": True,
            "ocupacion": "Ingeniero",
            "condicion_laboral": "Independiente",
            "institucion_empresa": "Consultora XYZ",
            "proceso": "2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO",
            "modalidad": "ADMISIÓN ORDINARIA",
            "area_academica": "Ingeniería",
            "escuela_profesional": "Ingeniería Civil",
            "programa_academico": "Programa Regular",
            "tipo_educacion": "Privado",
            "estudios_concluidos": "Sí",
            "departamento_estudio": "Ica",
            "provincia_estudio": "Ica",
            "institucion_educativa": "Colegio San Luis Gonzaga",
            "periodo_inicio": "2013",
            "periodo_fin": "2018",
            "discapacidad": "Ninguna",
            "preparacion_universitaria": "Academia particular",
            "medio_difusion": "Internet",
            "acepta_terminos": True,
            "pago_validado": True,
            "estado_registro": "Completo",
            "familiar": {
                "tipo_familiar": "Padre",
                "nombre": "Juan Rojas",
                "relacion": "Padre",
                "ocupacion": "Contador",
                "centro_laboral": "Empresa ABC",
                "telefono": "956123456",
                "correo": "juan.rojas@example.com",
            },
            "pago": {"tipo": "Entidad Financiera (Banco/Caja)", "nro_operacion": "OP001234", "monto": Decimal("400.00"), "fecha_pago": "2026-01-15"},
        },
        {
            "nombres": "María",
            "apellido_paterno": "Cortés",
            "apellido_materno": "Mendoza",
            "tipo_documento": "DNI",
            "nro_documento": "87654321",
            "fecha_nacimiento": "1996-07-22",
            "sexo": "Femenino",
            "estado_civil": "Soltera",
            "numero_hijos": "0",
            "procedencia": "Perú",
            "pais_nacimiento": "Perú",
            "departamento_nacimiento": "Lima",
            "provincia_nacimiento": "Lima",
            "distrito_nacimiento": "Surco",
            "departamento_domicilio": "Ica",
            "provincia_domicilio": "Ica",
            "distrito_domicilio": "Ica",
            "direccion": "Av. Ejército 456",
            "correo": "maria.cortes@example.com",
            "telefono1": "987456123",
            "trabaja": False,
            "proceso": "2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO",
            "modalidad": "ADMISIÓN ORDINARIA",
            "area_academica": "Administración",
            "escuela_profesional": "Administración",
            "programa_academico": "Programa Regular",
            "tipo_educacion": "Público",
            "estudios_concluidos": "Sí",
            "departamento_estudio": "Lima",
            "provincia_estudio": "Lima",
            "institucion_educativa": "IE República Argentina",
            "periodo_inicio": "2012",
            "periodo_fin": "2017",
            "discapacidad": "Ninguna",
            "preparacion_universitaria": "CEPU-UNICA",
            "medio_difusion": "Redes Sociales",
            "acepta_terminos": True,
            "pago_validado": True,
            "estado_registro": "Completo",
            "familiar": {
                "tipo_familiar": "Madre",
                "nombre": "Rosa Mendoza",
                "relacion": "Madre",
                "ocupacion": "Docente",
                "centro_laboral": "IE Estatal",
                "telefono": "987456123",
                "correo": "rosa.mendoza@example.com",
            },
            "pago": {"tipo": "Transferencia", "nro_operacion": "TR009876", "monto": Decimal("400.00"), "fecha_pago": "2026-01-18"},
        },
        {
            "nombres": "Carlos",
            "apellido_paterno": "Hernández",
            "apellido_materno": "López",
            "tipo_documento": "DNI",
            "nro_documento": "11223344",
            "fecha_nacimiento": "1997-11-05",
            "sexo": "Masculino",
            "estado_civil": "Soltero",
            "procedencia": "Perú",
            "pais_nacimiento": "Perú",
            "departamento_nacimiento": "Ica",
            "provincia_nacimiento": "Ica",
            "distrito_nacimiento": "Ica",
            "departamento_domicilio": "Ica",
            "provincia_domicilio": "Ica",
            "distrito_domicilio": "Ica",
            "direccion": "Jr. Libertad 321",
            "correo": "carlos.hernandez@example.com",
            "telefono1": "951234567",
            "trabaja": False,
            "proceso": "2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO",
            "modalidad": "ADMISIÓN ORDINARIA",
            "area_academica": "Ingeniería",
            "escuela_profesional": "Ingeniería Civil",
            "programa_academico": "Programa Regular",
            "tipo_educacion": "Público",
            "estudios_concluidos": "cursando 5° año",
            "departamento_estudio": "Ica",
            "provincia_estudio": "Ica",
            "institucion_educativa": "IE Palma",
            "discapacidad": "Ninguna",
            "medio_difusion": "Familia y/o amigos",
            "acepta_terminos": True,
            "pago_validado": False,
            "estado_registro": "Pendiente",
        },
        {
            "nombres": "Ana",
            "apellido_paterno": "Martínez",
            "apellido_materno": "Silva",
            "tipo_documento": "DNI",
            "nro_documento": "55667788",
            "fecha_nacimiento": "1998-04-18",
            "sexo": "Femenino",
            "estado_civil": "Soltera",
            "procedencia": "Perú",
            "pais_nacimiento": "Perú",
            "departamento_nacimiento": "Ica",
            "provincia_nacimiento": "Ica",
            "distrito_nacimiento": "Ica",
            "departamento_domicilio": "Ica",
            "provincia_domicilio": "Ica",
            "distrito_domicilio": "Ica",
            "direccion": "Calle Moquegua 78",
            "correo": "ana.martinez@example.com",
            "telefono1": "943345678",
            "trabaja": True,
            "ocupacion": "Técnica en enfermería",
            "condicion_laboral": "Dependiente",
            "institucion_empresa": "Clínica San José",
            "proceso": "2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO",
            "modalidad": "ADMISIÓN ORDINARIA",
            "area_academica": "Ciencias de la Salud",
            "escuela_profesional": "Enfermería",
            "programa_academico": "Programa Regular",
            "tipo_educacion": "Privado",
            "estudios_concluidos": "Sí",
            "departamento_estudio": "Ica",
            "provincia_estudio": "Ica",
            "institucion_educativa": "Colegio Las Mercedes",
            "periodo_inicio": "2014",
            "periodo_fin": "2019",
            "discapacidad": "Ninguna",
            "medio_difusion": "Internet",
            "acepta_terminos": True,
            "pago_validado": True,
            "estado_registro": "Completo",
            "pago": {"tipo": "Depósito en efectivo", "nro_operacion": "DEP443322", "monto": Decimal("400.00"), "fecha_pago": "2026-01-20"},
        },
        {
            "nombres": "Pedro",
            "apellido_paterno": "González",
            "apellido_materno": "Torres",
            "tipo_documento": "DNI",
            "nro_documento": "99887766",
            "fecha_nacimiento": "1995-09-30",
            "sexo": "Masculino",
            "estado_civil": "Casado",
            "numero_hijos": "1",
            "procedencia": "Perú",
            "pais_nacimiento": "Perú",
            "departamento_nacimiento": "Arequipa",
            "provincia_nacimiento": "Arequipa",
            "distrito_nacimiento": "Yanahuara",
            "departamento_domicilio": "Ica",
            "provincia_domicilio": "Ica",
            "distrito_domicilio": "Ica",
            "direccion": "Av. Los Álamos 567",
            "correo": "pedro.gonzalez@example.com",
            "telefono1": "912345678",
            "trabaja": True,
            "ocupacion": "Gestor comercial",
            "condicion_laboral": "Dependiente",
            "institucion_empresa": "Banco de la Nación",
            "proceso": "2026-1 – PROCESO DE ADMISIÓN 2026-1 ORDINARIO",
            "modalidad": "ADMISIÓN ORDINARIA",
            "area_academica": "Administración",
            "escuela_profesional": "Administración",
            "programa_academico": "Programa Para Gente Que Trabaja",
            "tipo_educacion": "Público",
            "estudios_concluidos": "Sí",
            "departamento_estudio": "Arequipa",
            "provincia_estudio": "Arequipa",
            "institucion_educativa": "IE República de Chile",
            "periodo_inicio": "2010",
            "periodo_fin": "2015",
            "discapacidad": "Ninguna",
            "medio_difusion": "Internet",
            "acepta_terminos": True,
            "pago_validado": False,
            "estado_registro": "Pendiente",
        },
    ]

    for data in datos:
        existing = db.query(Postulante).filter(Postulante.nro_documento == data["nro_documento"]).first()
        if existing:
            print(f"[SKIP] Postulante {data['nro_documento']} ya existe -- omitiendo.")
            continue

        familiar_data = data.pop("familiar", None)
        pago_data = data.pop("pago", None)

        postulante = Postulante(**data)
        db.add(postulante)
        db.flush()

        if familiar_data:
            familiar = Familiar(postulante_id=postulante.id, **familiar_data)
            db.add(familiar)

        if pago_data:
            pago = Pago(postulante_id=postulante.id, **pago_data)
            db.add(pago)

        print(f"[OK] Postulante creado: {postulante.nombres} {postulante.apellido_paterno} (DNI: {postulante.nro_documento})")

    db.commit()


def main():
    print("\n[SEED] Iniciando seed del Sistema de Inscripcion UNICA...\n")
    create_all_tables()

    db = SessionLocal()
    try:
        seed_admins(db)
        seed_postulantes(db)
        db.commit()
        print("\n[OK] Seed completado exitosamente!")
        print("-" * 50)
        print("  Admin: admin / admin123")
        print("  Postulantes de prueba: 5 registros")
        print("-" * 50)
        print("  Ahora puedes iniciar el servidor con:")
        print("  python run.py")
        print("")
    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Error durante el seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
