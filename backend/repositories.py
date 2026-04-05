# Репозиторий для работы с базой данных (SQL запросы к БД)

from base_repository import BaseRepository
from entities import Admin, Program, About, Case, News, Partner, PhotoAlbum, Photo, PhotoAlbumWithPhotos, Review, Registration, Participant
from typing import List, Optional, Dict, Any


class AdminRepository:
    def __init__(self, connection):
        self.connection = connection

    def get_by_login(self, login: str) -> Optional[tuple]:
        query = "SELECT id, login, password_hash FROM admins WHERE login = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (login,))
                row = cursor.fetchone()
        return row


class ProgramRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection, table_name="program", entity_class=Program,
            columns=["date", "text", "order_index"])
        
    def get_all_ordered(self) -> List[Program]:
        query = """SELECT id, date, text, order_index, created_at FROM program ORDER BY order_index"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        return [Program(*row) for row in rows]

    def update(self, program_id: int, item: Program) -> None:
        query = """UPDATE program SET date=%s, text=%s, order_index=%s WHERE id=%s"""
        values = [item.date, item.text, item.order_index, program_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)

    def delete(self, program_id: int) -> None:
        query = "DELETE FROM program WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (program_id,))


class AboutRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection, table_name="about", entity_class=About,
            columns=["row", "col", "title", "text", "icon", "created_at"])
        
    def get_all_ordered(self) -> List[About]:
        query = """SELECT id, row, col, title, text, icon, created_at FROM about"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        return [About(*row) for row in rows]

    def update(self, about_id: int, item: About) -> None:
        query = """UPDATE about SET row=%s, col=%s, title=%s, text=%s, icon=%s, created_at=%s WHERE id=%s"""
        values = [item.row, item.col, item.title, item.text, item.icon, item.created_at, about_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)

    def delete(self, about_id: int) -> None:
        query = "DELETE FROM about WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (about_id,))


class CasesRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection, table_name="cases", entity_class=Case,
            columns=["name", "case_number", "level", "description", "partner_id", "is_available"])

    def _fetch_all_dict(self, cursor) -> List[Dict[str, Any]]:
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor) -> Optional[Dict[str, Any]]:
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def update(self, case_id: int, case: Case) -> None:
        query = """UPDATE cases SET name=%s, case_number=%s, level=%s, description=%s, partner_id=%s WHERE id=%s"""
        values = [case.name, case.case_number, case.level, case.description, case.partner_id, case_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)

    def get_all_with_partner(self) -> List[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, p.name as partner_name, c.is_available
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id WHERE c.is_available = TRUE ORDER BY c.case_number"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id_with_partner(self, case_id: int) -> Optional[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, p.name as partner_name, c.is_available
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id WHERE c.id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (case_id,))
                return self._fetch_one_dict(cursor)


class NewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection, table_name="news", entity_class=News,
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
            connection=connection, table_name="partners", entity_class=Partner,
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
            connection=connection, table_name="photoalbums", entity_class=PhotoAlbum,
            columns=["image", "created_at", "is_available"])
        
    def get_all_with_photos(self) -> List[Dict[str, Any]]:
        query = """SELECT pa.id, pa.image, pa.created_at, pa.is_available, p.id, p.photoalbum_id, p.path, p.created_at, p.is_available
                FROM photoalbums pa LEFT JOIN photos p ON pa.id = p.photoalbum_id WHERE pa.is_available = TRUE ORDER BY pa.id"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        albums = {}
        for row in rows:
            pa_id, image, created_at, is_available, p_id, p_album_id, path, p_created_at, p_is_available = row
            if pa_id not in albums:
                albums[pa_id] = PhotoAlbumWithPhotos(album=PhotoAlbum(pa_id, image, created_at, is_available), photos=[])
            if p_id:
                albums[pa_id].photos.append(Photo(p_id, p_album_id, path, p_created_at, p_is_available))
        return list(albums.values())
    
    def get_by_id_with_photos(self, photoalbum_id: int) -> Optional[Dict[str, Any]]:
        query = """SELECT pa.id, pa.image, pa.created_at, pa.is_available, p.id, p.photoalbum_id, p.path, p.created_at, p.is_available
                FROM photoalbums pa LEFT JOIN photos p ON pa.id = p.photoalbum_id WHERE pa.id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (photoalbum_id,))
                rows = cursor.fetchall()
        if not rows: return None
        album = None
        photos = []
        for row in rows:
            pa_id, image, created_at, is_available, p_id, p_album_id, path, p_created_at, p_is_available = row
            if not album:
                album = PhotoAlbum(pa_id, image, created_at, is_available)
            if p_id:
                photos.append(Photo(p_id, p_album_id, path, p_created_at, p_is_available))
        return PhotoAlbumWithPhotos(album=album, photos=photos)

    def update(self, photoalbum_id: int, photoalbum: PhotoAlbum) -> None:
        query = """UPDATE photoalbums SET image=%s, created_at=%s WHERE id=%s"""
        values = [photoalbum.image, photoalbum.created_at, photoalbum_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class PhotosRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection, table_name="photos", entity_class=Photo,
            columns=["photoalbum_id", "path", "created_at", "is_available"])
    
    def update(self, photo_id: int, photo: Photo) -> None:
        query = """UPDATE photos
            SET photoalbum_id=%s, path=%s, created_at=%s WHERE id=%s"""
        values = [photo.photo_album_id, photo.path, photo.created_at, photo_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class ReviewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection, table_name="reviews", entity_class=Review,
            columns=["name", "content", "image", "created_at", "is_available"])
    
    def update(self, review_id: int, review: Review) -> None:
        query = """UPDATE reviews
            SET name=%s, content=%s, image=%s, created_at=%s WHERE id=%s"""
        values = [review.name, review.content, review.image, review.created_at, review_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)