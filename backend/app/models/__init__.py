# Importar todos los modelos para que SQLAlchemy los registre correctamente
from app.models.admin import Admin
from app.models.postulante import Postulante
from app.models.familiar import Familiar
from app.models.pago import Pago
from app.models.documento import Documento

__all__ = ["Admin", "Postulante", "Familiar", "Pago", "Documento"]
