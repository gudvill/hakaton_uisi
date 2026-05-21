import psycopg2
from config import settings
from fastapi import Depends, HTTPException, Request
from jose import jwt, JWTError
from security import SECRET_KEY, ALGORITHM
from repositories import StatsRepository, AdminRepository, AcquaintanceRepository, FaqRepository, ProgramRepository, AboutRepository, CasesRepository, NewsRepository, PartnersRepository, PhotoAlbumsRepository, PhotosRepository, ReviewsRepository, RegistrationRepository
from use_cases import StatsUseCase, AdminUseCase, AcquaintanceUseCase, FaqUseCase, ProgramUseCase, AboutUseCase, CasesUseCase, NewsUseCase, PartnersUseCase, PhotoAlbumsUseCase, PhotosUseCase, ReviewsUseCase, RegistrationUseCase


def get_current_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Токен отсутствует")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Неверный токен")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

# connection к postgres
def get_connection():
    conn = psycopg2.connect(settings.database_connection_string)
    return conn

def get_stats_usecase() -> StatsUseCase:
    repository = StatsRepository(get_connection)
    return StatsUseCase(repository)

def get_admin_usecase() -> AdminUseCase:
    repository = AdminRepository(get_connection)
    return AdminUseCase(repository)

def get_acquaintance_usecase() -> AcquaintanceUseCase:
    repository = AcquaintanceRepository(get_connection)
    return AcquaintanceUseCase(repository)

def get_faq_usecase() -> FaqUseCase:
    repository = FaqRepository(get_connection)
    return FaqUseCase(repository)

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
    photoalbums_repository = PhotoAlbumsRepository(get_connection)
    photos_repository = PhotosRepository(get_connection)
    return PhotoAlbumsUseCase(photoalbums_repository, photos_repository)

def get_photos_usecase() -> PhotosUseCase:
    repository = PhotosRepository(get_connection)
    return PhotosUseCase(repository)

def get_reviews_usecase() -> ReviewsUseCase:
    repository = ReviewsRepository(get_connection)
    return ReviewsUseCase(repository)

def get_registration_usecase() -> RegistrationUseCase:
    registration_repository = RegistrationRepository(get_connection)
    cases_repository = CasesRepository(get_connection)
    return RegistrationUseCase(registration_repository, cases_repository)