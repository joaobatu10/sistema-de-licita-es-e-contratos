from sqlalchemy import Column, Integer, String, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base

class Licitacao(Base):
    __tablename__ = "licitacoes"

    id_licitacao = Column(Integer, primary_key=True, index=True)
    numero_processo = Column(String(50), nullable=False, unique=True)
    modalidade = Column(String(30), nullable=False)
    objeto = Column(String, nullable=False)
    orgao_responsavel = Column(String(100), nullable=False)
    data_abertura = Column(Date, nullable=False)
    data_encerramento = Column(Date, nullable=True)
    status = Column(String(20), nullable=False)

    # Relacionamento com contratos
    contratos = relationship("Contrato", back_populates="licitacao")

    __table_args__ = (UniqueConstraint("numero_processo", name="uq_numero_processo"),)
