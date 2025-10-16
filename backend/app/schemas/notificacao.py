from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificacaoBase(BaseModel):
    titulo: str
    mensagem: str
    tipo: str  # "info", "warning", "error", "success"
    usuario_id: Optional[int] = None  # None = notificação global

class NotificacaoCreate(NotificacaoBase):
    pass

class NotificacaoUpdate(BaseModel):
    titulo: Optional[str] = None
    mensagem: Optional[str] = None
    tipo: Optional[str] = None
    lida: Optional[bool] = None

class NotificacaoOut(NotificacaoBase):
    id: int
    lida: bool
    data_criacao: datetime
    data_leitura: Optional[datetime] = None
    
    class Config:
        from_attributes = True