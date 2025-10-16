import sys
import os

# Adicionar o diretório backend ao path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from passlib.context import CryptContext

# Para verificar senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_password():
    # Hash do admin no banco: $2b$12$F7CDFt6J7S4sIRd43juW6.3aOwvef2rfeQaR5lrJdEA7n.cCFM5rW
    admin_hash = "$2b$12$F7CDFt6J7S4sIRd43juW6.3aOwvef2rfeQaR5lrJdEA7n.cCFM5rW"
    
    # Testar algumas senhas comuns
    senhas_teste = ["123456", "admin", "admin123", "password", "123", "test"]
    
    print("Testando senhas para o usuário 'admin':")
    for senha in senhas_teste:
        resultado = pwd_context.verify(senha, admin_hash)
        print(f"Senha '{senha}': {'✅ CORRETA' if resultado else '❌ Incorreta'}")

if __name__ == "__main__":
    test_password()