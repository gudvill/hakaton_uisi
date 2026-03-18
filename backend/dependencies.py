from repositories import CasesRepository
from use_cases import CasesUseCase
import psycopg2
from config import settings

# connection к postgres
def get_connection():
    conn = psycopg2.connect(settings.database_connection_string)
    return conn

def get_cases_usecase() -> CasesUseCase:
    repository = CasesRepository(get_connection)
    return CasesUseCase(repository)