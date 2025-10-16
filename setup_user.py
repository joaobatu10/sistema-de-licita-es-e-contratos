import sys
import os

# Adicionar o diretório backend ao path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from sqlalchemy import create_engine, text
from passlib.context import CryptContext

# Configuração do banco
DATABASE_URL = "sqlite:///./licitacoes.db"
engine = create_engine(DATABASE_URL)

# Para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def check_and_create_user():
    with engine.connect() as conn:
        # Verificar se a tabela usuarios existe
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios';"))
        table_exists = result.fetchone()
        
        if not table_exists:
            print("Tabela 'usuarios' não existe!")
            return
            
        # Verificar usuários existentes
        result = conn.execute(text("SELECT id_usuario, username, email FROM usuarios"))
        users = result.fetchall()
        
        print(f"Usuários encontrados: {len(users)}")
        for user in users:
            print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}")
        
        if len(users) == 0:
            print("\nCriando usuário de teste...")
            
            # Criar usuário de teste
            hashed_password = pwd_context.hash("123456")
            
            try:
                conn.execute(text("""
                    INSERT INTO usuarios (username, email, senha_hash, nome_completo, ativo)
                    VALUES (:username, :email, :senha_hash, :nome_completo, :ativo)
                """), {
                    "username": "admin",
                    "email": "admin@teste.com",
                    "senha_hash": hashed_password,
                    "nome_completo": "Administrador",
                    "ativo": True
                })
                conn.commit()
                print("Usuário 'admin' criado com senha '123456'")
                
            except Exception as e:
                print(f"Erro ao criar usuário: {e}")

if __name__ == "__main__":
    check_and_create_user()