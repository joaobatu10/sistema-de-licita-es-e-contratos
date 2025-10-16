import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import Usuario

def check_users():
    db = SessionLocal()
    try:
        users = db.query(Usuario).all()
        print(f"Total de usuários: {len(users)}")
        
        for user in users:
            print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")
            
        if len(users) == 0:
            print("Nenhum usuário encontrado no banco de dados!")
            print("Você precisa criar um usuário primeiro.")
            
    except Exception as e:
        print(f"Erro ao verificar usuários: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()