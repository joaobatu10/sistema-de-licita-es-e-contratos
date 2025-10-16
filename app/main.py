from fastapi import FastAPI, Form, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import engine, get_db
from app.db import base  # importa modelos para o create_all
from app.api.routes.users import router as users_router
from app.api.routes.licitacoes import router as licitacoes_router
from app.api.routes.contratos import router as contratos_router
from app.api.routes.notificacoes import router as notificacoes_router
from app.models.user import Usuario
from app.core.auth import verify_password, create_access_token
from app.schemas.user import Token
from datetime import timedelta

app = FastAPI(title="Monitoramento de Licitações e Contratos")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# cria tabelas (simples – depois você pode migrar para Alembic)
@app.on_event("startup")
def on_startup():
    base.Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API rodando"}

@app.post("/login", response_model=Token)
def login_global(username: str = Form(), password: str = Form(), db: Session = Depends(get_db)):
    """Rota de login global - autentica usuário e retorna token JWT"""
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

# rotas
app.include_router(users_router)
app.include_router(licitacoes_router)
app.include_router(contratos_router)
app.include_router(notificacoes_router)
