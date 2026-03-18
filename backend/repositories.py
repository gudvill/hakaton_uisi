# Репозиторий для работы с базой данных (SQL запросы к БД)

from base_repository import BaseRepository
from entities import Main, Admin, Case, News, Partner, PhotoAlbum, Photo, Review, Registration, Participant

class CasesRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="cases",
            entity_class=Case,
            columns=["name", "case_number", "image", "level", "description", "partner_id", "role", "is_available"])
    
    def update(self, case_id: int, case: Case) -> None:
        query = """UPDATE cases
            SET name=%s, case_number=%s, image=%s, level=%s, description=%s, partner_id=%s, role=%s WHERE id=%s"""
        values = [case.name, case.case_number, case.image, case.level, case.description, case.partner_id, case.role, case_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class NewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="news",
            entity_class=News,
            columns=["name", "image", "created_at", "brief_description", "full_description", "is_available"])
    
    def update(self, news_id: int, news: News) -> None:
        query = """UPDATE news
            SET name=%s, image=%s, created_at=%s, brief_description=%s, full_description=%s WHERE id=%s"""
        values = [news.name, news.image, news.created_at, news.brief_description, news.full_description, news_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class PartnersRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="partners",
            entity_class=Partner,
            columns=["name", "description", "image", "created_at", "is_available"])
    
    def update(self, partner_id: int, partner: Partner) -> None:
        query = """UPDATE news
            SET name=%s, description=%s, image=%s, created_at=%s WHERE id=%s"""
        values = [partner.name, partner.description, partner.image, partner.created_at, partner_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class PhotoAlbumsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="photoalbums",
            entity_class=PhotoAlbum,
            columns=["image", "created_at", "is_available"])
    
    def update(self, photoalbum_id: int, photoalbum: PhotoAlbum) -> None:
        query = """UPDATE photoalbums
            SET image=%s, created_at=%s WHERE id=%s"""
        values = [photoalbum.image, photoalbum.created_at, photoalbum_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class PhotosRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="photos",
            entity_class=Photo,
            columns=["photo_album_id", "path", "created_at", "is_available"])
    
    def update(self, photo_id: int, photo: Photo) -> None:
        query = """UPDATE photos
            SET photo_album_id=%s, path=%s, created_at=%s WHERE id=%s"""
        values = [photo.photo_album_id, photo.path, photo.created_at, photo_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class ReviewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="reviews",
            entity_class=Review,
            columns=["name", "content", "image", "created_at", "is_available"])
    
    def update(self, review_id: int, review: Review) -> None:
        query = """UPDATE reviews
            SET name=%s, content=%s, image=%s, created_at=%s WHERE id=%s"""
        values = [review.name, review.content, review.image, review.created_at, review_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)