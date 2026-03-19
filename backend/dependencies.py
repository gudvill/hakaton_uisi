from repositories import CasesRepository, NewsRepository, PartnersRepository, PhotoAlbumsRepository, PhotosRepository, ReviewsRepository
from use_cases import CasesUseCase, NewsUseCase, PartnersUseCase, PhotoAlbumsUseCase, PhotosUseCase, ReviewsUseCase
import psycopg2
from config import settings

# connection к postgres
def get_connection():
    conn = psycopg2.connect(settings.database_connection_string)
    return conn

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