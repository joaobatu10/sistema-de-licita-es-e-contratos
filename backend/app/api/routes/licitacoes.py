from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.licitacao import Licitacao
from app.schemas.licitacao import LicitacaoCreate

router = APIRouter(prefix="/licitacoes", tags=["Licitações"])

@router.get("")
def listar(db: Session = Depends(get_db)):
    return db.query(Licitacao).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def criar(payload: LicitacaoCreate, db: Session = Depends(get_db)):
    if db.query(Licitacao).filter(Licitacao.numero_processo == payload.numero_processo).first():
        raise HTTPException(409, "Número de processo já cadastrado")
    nova = Licitacao(**payload.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@router.get("/{id_licitacao}")
def obter(id_licitacao: int, db: Session = Depends(get_db)):
    lic = db.query(Licitacao).get(id_licitacao)
    if not lic:
        raise HTTPException(404, "Licitação não encontrada")
    return lic

@router.delete("/{id_licitacao}", status_code=status.HTTP_204_NO_CONTENT)
def excluir(id_licitacao: int, db: Session = Depends(get_db)):
    lic = db.query(Licitacao).get(id_licitacao)
    if not lic:
        raise HTTPException(404, "Licitação não encontrada")
    db.delete(lic)
    db.commit()
