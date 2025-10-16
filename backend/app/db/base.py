from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# importe os modelos aqui para o create_all encontrar
from app.models.user import Usuario  # noqa
from app.models.licitacao import Licitacao  # noqa
from app.models.contrato import Contrato  # noqa
from app.models.notificacao import Notificacao  # noqa