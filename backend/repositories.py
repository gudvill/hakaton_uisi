# Репозиторий для работы с базой данных (SQL запросы к БД)

from base_repository import BaseRepository
from entities import Admin, Acquaintance, Program, About, Case, News, Partner, PhotoAlbum, Photo, PhotoAlbumWithPhotos, Review, Registration, Participant
from typing import List, Optional, Dict, Any
from datetime import datetime
import json


class AdminRepository:
    def __init__(self, connection):
        self.connection = connection

    def get_by_login(self, login: str) -> Optional[tuple]:
        query = "SELECT id, login, password_hash, email FROM admins WHERE login = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (login,))
                return cursor.fetchone()

    def get_by_email(self, email: str):
        query = "SELECT id, login, password_hash, email FROM admins WHERE email = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (email,))
                return cursor.fetchone()

    def save_password_reset_token(self, admin_id: int, token: str, expires_at: datetime):
        query = "INSERT INTO password_reset_tokens (admin_id, token, expires_at, used) VALUES (%s, %s, %s, FALSE)"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (admin_id, token, expires_at))

    def get_reset_token(self, token: str):
        query = "SELECT id, admin_id, token, expires_at, used FROM password_reset_tokens WHERE token = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (token,))
                return cursor.fetchone()

    def mark_token_used(self, token_id: int):
        query = "UPDATE password_reset_tokens SET used=TRUE WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (token_id,))

    def update_password(self, admin_id: int, password_hash: str):
        query = "UPDATE admins SET password_hash=%s WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (password_hash, admin_id))


class AcquaintanceRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="acquaintance", entity_class=Acquaintance,
            columns=["title", "text"])

    def update(self, acquaintance_id: int, item: Acquaintance) -> None:
        query = """UPDATE acquaintance SET title=%s, text=%s WHERE id=%s"""
        values = [item.title, item.text, acquaintance_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)

    def get_by_title(self, title: str) -> Optional[Acquaintance]:
        query = """SELECT id, title, text FROM acquaintance WHERE title=%s LIMIT 1"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, [title])
                row = cursor.fetchone()
                if row: return self.entity_class(id=row[0], title=row[1], text=row[2])
                return None


class ProgramRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="program", entity_class=Program,
            columns=["start_date", "end_date", "text", "order_index"])
        
    def _fetch_all_dict(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor):
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def get_all(self):
        query = """SELECT id, start_date, end_date, text, order_index, created_at FROM program ORDER BY order_index"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id(self, program_id: int):
        query = """SELECT id, start_date, end_date, text, order_index, created_at FROM program WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (program_id,))
                return self._fetch_one_dict(cursor)

    def get_event_date(self):
        query = """SELECT start_date FROM program WHERE order_index = 1 LIMIT 1"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                row = cursor.fetchone()
                return row[0] if row else None

    def delete(self, program_id: int) -> None:
        query = "DELETE FROM program WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (program_id,))


class AboutRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="about", entity_class=About,
            columns=["row", "col", "title", "text", "icon"])

    def _fetch_all_dict(self, cursor) -> List[Dict[str, Any]]:
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor) -> Optional[Dict[str, Any]]:
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))
    
    def get_all(self):
        query = """SELECT id, row, col, title, text, icon, created_at FROM about ORDER BY row, col"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id(self, item_id: int):
        query = """SELECT id, row, col, title, text, icon, created_at FROM about WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (item_id,))
                return self._fetch_one_dict(cursor)

    def delete(self, about_id: int) -> None:
        query = "DELETE FROM about WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (about_id,))


class CasesRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="cases", entity_class=Case,
            columns=["name", "case_number", "level", "description", "partner_id", "is_available", "teams_count"])

    def _fetch_all_dict(self, cursor) -> List[Dict[str, Any]]: # вынести в базовый репозиторий
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor) -> Optional[Dict[str, Any]]:
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def get_all_with_partner(self) -> List[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id AND r.is_available = TRUE
            WHERE c.is_available = TRUE GROUP BY c.id, p.name, p.image ORDER BY c.case_number"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id_with_partner(self, case_id: int) -> Optional[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id AND r.is_available = TRUE
            WHERE c.id = %s GROUP BY c.id, p.name, p.image"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (case_id,))
                return self._fetch_one_dict(cursor)
            
    def get_unavailable(self) -> List[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id AND r.is_available = TRUE
            WHERE c.is_available = FALSE GROUP BY c.id, p.name, p.image ORDER BY c.created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
    
    def get_by_year(self, year: int) -> List[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id AND r.is_available = TRUE
            WHERE EXTRACT(YEAR FROM c.created_at) = %s GROUP BY c.id, p.name, p.image ORDER BY c.case_number"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (year,))
                return self._fetch_all_dict(cursor)


class NewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="news", entity_class=News,
            columns=["name", "image", "brief_description", "full_description", "is_available"])

    def _fetch_all_dict(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor):
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def get_all_true(self):
        query = """SELECT id, name, image, created_at, brief_description, full_description, is_available FROM news WHERE is_available = TRUE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    def get_all_false(self):
        query = """SELECT id, name, image, created_at, brief_description, full_description, is_available FROM news WHERE is_available = FALSE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id(self, news_id: int):
        query = """SELECT id, name, image, created_at, brief_description, full_description, is_available FROM news WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (news_id,))
                return self._fetch_one_dict(cursor)

    def get_by_year(self, year: int):
        query = """ SELECT id, name, image, created_at, brief_description, full_description, is_available FROM news WHERE EXTRACT(YEAR FROM created_at) = %s AND is_available = TRUE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (year,))
                return self._fetch_all_dict(cursor)

class PartnersRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="partners", entity_class=Partner,
            columns=["name", "image", "description", "full_description", "site_link", "is_available"])

    def _fetch_all_dict(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor):
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def get_all_true(self):
        query = """SELECT id, name, image, description, full_description, site_link, is_available FROM partners WHERE is_available = TRUE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    def get_all_false(self):
        query = """SELECT id, name, image, description, full_description, site_link, is_available FROM partners WHERE is_available = FALSE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id(self, news_id: int):
        query = """SELECT id, name, image, description, full_description, site_link, is_available FROM partners WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (news_id,))
                return self._fetch_one_dict(cursor)


class ReviewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="reviews", entity_class=Review,
            columns=["name", "content", "image", "is_available"])

    def _fetch_all_dict(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor):
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def get_all_true(self):
        query = """SELECT id, name, content, image, created_at, is_available FROM reviews WHERE is_available = TRUE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    def get_all_false(self):
        query = """SELECT id, name, content, image, created_at, is_available FROM reviews WHERE is_available = FALSE ORDER BY created_at DESC"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    def get_by_id(self, news_id: int):
        query = """SELECT id, name, content, image, is_available FROM reviews WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (news_id,))
                return self._fetch_one_dict(cursor)


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
        query = """UPDATE photos SET photoalbum_id=%s, path=%s, created_at=%s WHERE id=%s"""
        values = [photo.photo_album_id, photo.path, photo.created_at, photo_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)


class RegistrationRepository:
    def __init__(self, connection):
        self.connection = connection

    def create_registration(self, reg: Registration, participants: list) -> int:
        query = """INSERT INTO registration 
        (name, institution, amount_participants, participation_form, level_education,
        selected_case, spare_case, captain_phone, captain_email, curator_data, agreement, acquaintance)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id"""
        values = (reg.name, reg.institution, reg.amount_participants, reg.participation_form, reg.level_education, reg.selected_case, reg.spare_case, reg.captain_phone, reg.captain_email, json.dumps(reg.curator_data), reg.agreement, reg.acquaintance)
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                reg_id = cursor.fetchone()[0]
                for p in participants:
                    cursor.execute("""INSERT INTO participants (fio, course, role, registration_id)
                        VALUES (%s,%s,%s,%s)""", (p["fio"].strip(), int(p["course"]), p["role"], reg_id))
                return reg_id

    def _fetch_all_dict(self, cursor) -> List[Dict[str, Any]]:
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    def _fetch_one_dict(self, cursor) -> Optional[Dict[str, Any]]:
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))
    
    def get_all(self) -> List[Dict[str, Any]]:
        query = """
        SELECT r.*, 
        COALESCE(
            json_agg(
                json_build_object(
                    'id', p.id,
                    'fio', p.fio,
                    'course', p.course,
                    'role', p.role,
                    'registration_id', p.registration_id,
                    'created_at', p.created_at,
                    'is_available', p.is_available
                )
            ) FILTER (WHERE p.id IS NOT NULL),
            '[]'
        ) as participants
        FROM registration r
        LEFT JOIN participants p 
            ON p.registration_id = r.id AND p.is_available = TRUE
        WHERE r.is_available = TRUE
        GROUP BY r.id
        """

        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    def get_by_id(self, reg_id: int) -> Optional[Dict[str, Any]]:
        query = """
        SELECT r.*, 
        COALESCE(
            json_agg(
                json_build_object(
                    'id', p.id,
                    'fio', p.fio,
                    'course', p.course,
                    'role', p.role,
                    'registration_id', p.registration_id,
                    'created_at', p.created_at,
                    'is_available', p.is_available
                )
            ) FILTER (WHERE p.id IS NOT NULL),
            '[]'
        ) as participants
        FROM registration r
        LEFT JOIN participants p 
            ON p.registration_id = r.id
        WHERE r.id = %s
        GROUP BY r.id
        """

        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (reg_id,))
                return self._fetch_one_dict(cursor)
        
    def disable_registration(self, reg_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE registration SET is_available=FALSE WHERE id=%s", (reg_id,))
                cursor.execute("UPDATE participants SET is_available=FALSE WHERE registration_id=%s", (reg_id,))

    def delete_participant(self, p_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM participants WHERE id=%s", (p_id,))

    def count_by_case(self, case_id: int, field: str) -> int:
        query = f"SELECT COUNT(*) FROM registration WHERE {field}=%s AND is_available=TRUE"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (case_id,))
                return cursor.fetchone()[0]
            
    def count_by_case_exclude_self(self, case_id: int, field: str, reg_id: int) -> int:
        query = f"""SELECT COUNT(*) FROM registration WHERE {field}=%s AND is_available=TRUE AND id != %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (case_id, reg_id))
                return cursor.fetchone()[0]

    def delete_participants_by_registration(self, reg_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM participants WHERE registration_id=%s", (reg_id,))

    def update_registration(self, reg_id: int, reg: Registration, participants: list) -> None:
        query = """UPDATE registration SET name=%s, institution=%s, amount_participants=%s, participation_form=%s, level_education=%s, selected_case=%s, spare_case=%s, captain_phone=%s, captain_email=%s, curator_data=%s, agreement=%s, acquaintance=%s WHERE id=%s"""
        values = (reg.name, reg.institution, reg.amount_participants, reg.participation_form, reg.level_education, reg.selected_case, reg.spare_case, reg.captain_phone, reg.captain_email, json.dumps(reg.curator_data), reg.agreement, reg.acquaintance, reg_id)
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                cursor.execute("DELETE FROM participants WHERE registration_id=%s", (reg_id,))
                for p in participants:
                    cursor.execute("""INSERT INTO participants (fio, course, role, registration_id)
                        VALUES (%s,%s,%s,%s)""", (p["fio"].strip(), int(p["course"]), p["role"], reg_id))
                    
    def exists_team_name(self, name: str, exclude_id: int = None) -> bool:
        query = "SELECT 1 FROM registration WHERE name = %s"
        params = [name]
        if exclude_id is not None:
            query += " AND id != %s"
            params.append(exclude_id)
        query += " LIMIT 1"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone() is not None

    def exists_participant(self, fio: str, course: int, exclude_registration_id: int = None) -> bool:
        query = "SELECT 1 FROM participants WHERE fio = %s AND course = %s"
        params = [fio, course]
        if exclude_registration_id is not None:
            query += " AND registration_id != %s"
            params.append(exclude_registration_id)
        query += " LIMIT 1"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone() is not None