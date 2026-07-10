from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.postulante import Postulante
from app.models.familiar import Familiar
from app.models.pago import Pago
from app.schemas.postulante import PostulanteCreate


def crear_postulante(db: Session, data: PostulanteCreate) -> Postulante:
    """
    Crea un nuevo postulante en la BD junto con su familiar (si aplica).
    Equivalente a @Transactional en Spring — si algo falla, hace rollback.
    """
    # Verificar que no exista ya ese DNI
    existente = db.query(Postulante).filter(
        Postulante.nro_documento == data.nro_documento
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un postulante con el documento {data.nro_documento}",
        )

    # Crear el postulante (mapeamos campos del schema al modelo)
    postulante = Postulante(
        nombres=data.nombres,
        apellido_paterno=data.apellido_paterno,
        apellido_materno=data.apellido_materno,
        tipo_documento=data.tipo_documento,
        nro_documento=data.nro_documento,
        fecha_nacimiento=data.fecha_nacimiento,
        sexo=data.sexo,
        estado_civil=data.estado_civil,
        numero_hijos=data.numero_hijos,
        procedencia=data.procedencia,
        pais_nacimiento=data.pais_nacimiento,
        departamento_nacimiento=data.departamento_nacimiento,
        provincia_nacimiento=data.provincia_nacimiento,
        distrito_nacimiento=data.distrito_nacimiento,
        departamento_domicilio=data.departamento_domicilio,
        provincia_domicilio=data.provincia_domicilio,
        distrito_domicilio=data.distrito_domicilio,
        direccion=data.direccion,
        correo=data.correo,
        telefono1=data.telefono1,
        telefono2=data.telefono2,
        trabaja=data.trabaja,
        ocupacion=data.ocupacion,
        condicion_laboral=data.condicion_laboral,
        institucion_empresa=data.institucion_empresa,
        proceso=data.proceso,
        modalidad=data.modalidad,
        area_academica=data.area_academica,
        escuela_profesional=data.escuela_profesional,
        programa_academico=data.programa_academico,
        tipo_educacion=data.tipo_educacion,
        educacion_extranjero_esp=data.educacion_extranjero_esp,
        estudios_concluidos=data.estudios_concluidos,
        departamento_estudio=data.departamento_estudio,
        provincia_estudio=data.provincia_estudio,
        institucion_educativa=data.institucion_educativa,
        periodo_inicio=data.periodo_inicio,
        periodo_fin=data.periodo_fin,
        discapacidad=data.discapacidad,
        discapacidad_detalle=data.discapacidad_detalle,
        preparacion_universitaria=data.preparacion_universitaria,
        medio_difusion=data.medio_difusion,
        medio_difusion_especifico=data.medio_difusion_especifico,
        acepta_terminos=data.acepta_terminos,
        estado_registro="Pendiente",
        pago_validado=False,
    )

    db.add(postulante)
    db.flush()  # Obtenemos el ID sin hacer commit aún

    # Guardar familiar si viene en el request
    if data.familiar_tipo and data.familiar_tipo != "Ninguno" and data.familiar_nombre:
        familiar = Familiar(
            postulante_id=postulante.id,
            tipo_familiar=data.familiar_tipo,
            nombre=data.familiar_nombre,
            relacion=data.familiar_relacion,
            ocupacion=data.familiar_ocupacion,
            centro_laboral=data.familiar_centro,
            telefono=data.familiar_telefono,
            correo=data.familiar_correo,
        )
        db.add(familiar)

    db.commit()
    db.refresh(postulante)
    return postulante


def obtener_postulante_por_id(db: Session, postulante_id: int) -> Postulante:
    postulante = db.query(Postulante).filter(Postulante.id == postulante_id).first()
    if not postulante:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Postulante con id {postulante_id} no encontrado",
        )
    return postulante


def obtener_postulante_por_documento(db: Session, nro_documento: str) -> Postulante:
    postulante = db.query(Postulante).filter(
        Postulante.nro_documento == nro_documento
    ).first()
    if not postulante:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Postulante con documento {nro_documento} no encontrado",
        )
    return postulante


def listar_postulantes(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    estado_registro: Optional[str] = None,
    pago_validado: Optional[bool] = None,
    escuela_profesional: Optional[str] = None,
) -> List[Postulante]:
    """Lista postulantes con filtros opcionales para el panel admin."""
    query = db.query(Postulante)

    if search:
        term = f"%{search}%"
        query = query.filter(
            Postulante.nombres.ilike(term) |
            Postulante.apellido_paterno.ilike(term) |
            Postulante.apellido_materno.ilike(term) |
            Postulante.nro_documento.ilike(term) |
            Postulante.correo.ilike(term)
        )

    if estado_registro:
        query = query.filter(Postulante.estado_registro == estado_registro)

    if pago_validado is not None:
        query = query.filter(Postulante.pago_validado == pago_validado)

    if escuela_profesional and escuela_profesional != "todos":
        query = query.filter(Postulante.escuela_profesional == escuela_profesional)

    return query.order_by(Postulante.created_at.desc()).offset(skip).limit(limit).all()


def cambiar_estado_postulante(
    db: Session, postulante_id: int, nuevo_estado: str
) -> Postulante:
    postulante = obtener_postulante_por_id(db, postulante_id)
    postulante.estado_registro = nuevo_estado
    db.commit()
    db.refresh(postulante)
    return postulante


def validar_pago_postulante(db: Session, postulante_id: int) -> Postulante:
    postulante = obtener_postulante_por_id(db, postulante_id)
    postulante.pago_validado = True
    postulante.estado_registro = "Completo"
    db.commit()
    db.refresh(postulante)
    return postulante
