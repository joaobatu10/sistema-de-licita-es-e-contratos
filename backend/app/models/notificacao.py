from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class Notificacao(Base):
    __tablename__ = "notificacoes"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    mensagem = Column(Text, nullable=False)
    tipo = Column(String(50), nullable=False)  # "info", "warning", "error", "success"
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)  # None = notificação global
    lida = Column(Boolean, default=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_leitura = Column(DateTime, nullable=True)
    
    # Relacionamento com usuário (opcional)
    usuario = relationship("Usuario", back_populates="notificacoes")