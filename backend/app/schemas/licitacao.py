from pydantic import BaseModel
from datetime import date
from typing import Optional

class LicitacaoCreate(BaseModel):
    numero_processo: str
    modalidade: str
    objeto: str
    orgao_responsavel: str
    data_abertura: date
    data_encerramento: Optional[date] = None
    status: str

class LicitacaoOut(LicitacaoCreate):
    id_licitacao: int
