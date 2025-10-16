import sys
import os

# Adicionar o diretório backend ao path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from sqlalchemy import create_engine, text

# Configuração do banco
DATABASE_URL = "sqlite:///./licitacoes.db"
engine = create_engine(DATABASE_URL)

def check_table_structure():
    with engine.connect() as conn:
        # Verificar se a tabela usuarios existe
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = result.fetchall()
        
        print("Tabelas no banco:")
        for table in tables:
            print(f"- {table[0]}")
        
        # Verificar estrutura da tabela usuarios se ela existir
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios';"))
        if result.fetchone():
            print("\nEstrutura da tabela 'usuarios':")
            result = conn.execute(text("PRAGMA table_info(usuarios);"))
            columns = result.fetchall()
            for col in columns:
                print(f"- {col[1]} ({col[2]})")
                
            # Verificar dados existentes
            print("\nUsuários existentes:")
            result = conn.execute(text("SELECT * FROM usuarios;"))
            users = result.fetchall()
            print(f"Total: {len(users)}")
            for user in users:
                print(f"User: {user}")
        else:
            print("\nTabela 'usuarios' não existe!")

if __name__ == "__main__":
    check_table_structure()