from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import Usuario
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.core.auth import get_password_hash, verify_password, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.get("")
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def criar_usuario(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.username == user.username).first():
        raise HTTPException(409, "Username já existe")
    if db.query(Usuario).filter(Usuario.email == user.email).first():
        raise HTTPException(409, "Email já existe")
    
    # Hash da senha
    hashed_password = get_password_hash(user.password)
    novo = Usuario(username=user.username, email=user.email, password=hashed_password)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return {"id": novo.id, "username": novo.username, "email": novo.email}

@router.post("/login", response_model=Token)
def login(username: str = Form(), password: str = Form(), db: Session = Depends(get_db)):
    """Rota de login - autentica usuário e retorna token JWT"""
    # Buscar usuário no banco
    user = db.query(Usuario).filter(Usuario.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar senha
    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }
