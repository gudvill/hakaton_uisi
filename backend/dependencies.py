import psycopg2
from config import settings
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from security import SECRET_KEY, ALGORITHM
from repositories import AdminRepository, AcquaintanceRepository, ProgramRepository, AboutRepository, CasesRepository, NewsRepository, PartnersRepository, PhotoAlbumsRepository, PhotosRepository, ReviewsRepository, RegistrationRepository
from use_cases import AdminUseCase, AcquaintanceUseCase, ProgramUseCase, AboutUseCase, CasesUseCase, NewsUseCase, PartnersUseCase, PhotoAlbumsUseCase, PhotosUseCase, ReviewsUseCase, RegistrationUseCase

security = HTTPBearer()

def get_current_admin(token=Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id: raise HTTPException(status_code=401)
        return user_id
    except JWTError:
        raise HTTPException(status_code=401)

# connection к postgres
def get_connection():
    conn = psycopg2.connect(settings.database_connection_string)
    return conn

def get_admin_usecase() -> AdminUseCase:
    repository = AdminRepository(get_connection)
    return AdminUseCase(repository)

def get_acquaintance_usecase() -> AcquaintanceUseCase:
    repository = AcquaintanceRepository(get_connection)
    return AcquaintanceUseCase(repository)

def get_program_usecase() -> ProgramUseCase:
    repository = ProgramRepository(get_connection)
    return ProgramUseCase(repository)

def get_about_usecase() -> AboutUseCase:
    repository = AboutRepository(get_connection)
    return AboutUseCase(repository)

def get_cases_usecase() -> CasesUseCase:
    repository = CasesRepository(get_connection)
    return CasesUseCase(repository)

def get_news_usecase() -> NewsUseCase:
    repository = NewsRepository(get_connection)
    return NewsUseCase(repository)

def get_partners_usecase() -> PartnersUseCase:
    repository = PartnersRepository(get_connection)
    return PartnersUseCase(repository)

def get_photoalbums_usecase() -> PhotoAlbumsUseCase:
    repository = PhotoAlbumsRepository(get_connection)
    return PhotoAlbumsUseCase(repository)

def get_photos_usecase() -> PhotosUseCase:
    repository = PhotosRepository(get_connection)
    return PhotosUseCase(repository)

def get_reviews_usecase() -> ReviewsUseCase:
    repository = ReviewsRepository(get_connection)
    return ReviewsUseCase(repository)

def get_registration_usecase() -> RegistrationUseCase:
    registration_repo = RegistrationRepository(get_connection)
    cases_repo = CasesRepository(get_connection)
    return RegistrationUseCase(registration_repo, cases_repo)