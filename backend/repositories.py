# Репозиторий для работы с базой данных (SQL запросы к БД)

from base_repository import BaseRepository
from entities import Admin, Acquaintance, Faq, Program, About, Case, News, Partner, PhotoAlbum, Photo, PhotoAlbumWithPhotos, Review, Registration, Participant
from typing import List, Optional, Dict, Any
from datetime import datetime
import json


class StatsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="registration", entity_class=None, columns=[])

    # 1. кол-во команд
    def count_teams(self):
        query = "SELECT COUNT(*) as count FROM registration"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchone()[0]

    # 2. кол-во участников
    def count_participants(self):
        query = "SELECT COUNT(*) FROM participants"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchone()[0]
            
    # 3. кол-во партнёров
    def count_partners(self):
        query = "SELECT COUNT(*) FROM partners"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchone()[0]

    # 4. кол-во кейсов
    def count_cases(self):
        query = "SELECT COUNT(*) FROM cases"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchone()[0]
            
    # 5. средний размер команды
    def average_team_size(self):
        query = "SELECT AVG(amount_participants) as avg_size FROM registration"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchone()[0]

    # 6. кол-во участников по уровню образования и по курсу
    def participants_by_level_and_course(self):
        query = "SELECT r.level_education, p.course, COUNT(*) as count FROM participants p JOIN registration r ON p.registration_id = r.id GROUP BY r.level_education, p.course"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    # 7. кол-во команд по годам
    def teams_by_year(self):
        query = "SELECT EXTRACT(YEAR FROM created_at) as year, COUNT(*) as count FROM registration GROUP BY year ORDER BY year"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    # 8. динамика регистраций по датам
    def registrations_dynamics(self):
        query = "SELECT DATE(created_at) as date, COUNT(*) as count FROM registration GROUP BY DATE(created_at) ORDER BY date"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    # 9. кол-во команд на форму участия (офлайн/онлайн)
    def participation_form_stats(self):
        query = "SELECT participation_form, COUNT(*) as count FROM registration GROUP BY participation_form"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)

    # 10. топ учебных заведений (кол-во команд на учебное заведение)
    def top_institutions(self):
        query = "SELECT institution, COUNT(*) as count FROM registration GROUP BY institution ORDER BY count DESC LIMIT 10"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            
    # 11. топ партнёров (кол-во кейсов на партнёра)
    def top_partners(self):
        query = "SELECT p.name, COUNT(c.id) as cases_count FROM partners p LEFT JOIN cases c ON c.partner_id = p.id GROUP BY p.id ORDER BY cases_count DESC"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                return self._fetch_all_dict(cursor)
            

class AdminRepository:
    def __init__(self, connection):
        self.connection = connection

    def get_by_id(self, admin_id: int):
        query = "SELECT id, login, email FROM admins WHERE id = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (admin_id,))
                return cursor.fetchone()

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
        
    def update_profile(self, admin_id: int, login: str, email: str):
        query = "UPDATE admins SET login=%s, email=%s WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (login, email, admin_id))
    
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
        super().__init__(connection=connection, table_name="acquaintance", entity_class=Acquaintance, columns=["title", "text"], has_is_available=False)
        

class FaqRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="faq", entity_class=Faq, columns=["question", "answer"], has_is_available=False)
        

class AboutRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="about", entity_class=About, columns=["row", "col", "title", "text", "icon"], has_is_available=False)


class ProgramRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="program", entity_class=Program, columns=["start_date", "end_date", "text", "order_index"], has_is_available=False)

    def get_event_date(self):
        query = """SELECT start_date FROM program WHERE order_index = 1 LIMIT 1"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                row = cursor.fetchone()
                return row[0] if row else None


class NewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="news", entity_class=News, columns=["name", "image", "brief_description", "full_description", "is_available"])
    
    def get_by_id(self, news_id: int): #
        query = """SELECT id, name, image, created_at, brief_description, full_description, is_available FROM news WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (news_id,))
                return self._fetch_one_dict(cursor)
            
    def get_filtered(self, search: str = None, year: int = None, sort_by: str = "created_at", sort_dir: str = "desc"):
        allowed_sort = { "name": "n.name", "created_at": "n.created_at" }
        sort_column = allowed_sort.get(sort_by, "n.created_at")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = "SELECT * FROM news n WHERE n.is_available = TRUE"
        params = []
        if search: # поиск по названию
            query += " AND LOWER(n.name) LIKE %s"
            params.append(f"%{search.lower()}%")
        if year: # фильтр по году
            query += " AND EXTRACT(YEAR FROM n.created_at) = %s"
            params.append(year)
        query += f" ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)
    
    def get_filtered_archived(self, search: str = None, year: int = None, sort_by: str = "created_at", sort_dir: str = "desc"):
        allowed_sort = { "name": "n.name", "created_at": "n.created_at" }
        sort_column = allowed_sort.get(sort_by, "n.created_at")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = "SELECT * FROM news n WHERE n.is_available = FALSE"
        params = []
        if search: # поиск по названию
            query += " AND LOWER(n.name) LIKE %s"
            params.append(f"%{search.lower()}%")
        if year: # фильтр по году
            query += " AND EXTRACT(YEAR FROM n.created_at) = %s"
            params.append(year)
        query += f" ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)


class CasesRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="cases", entity_class=Case, columns=["name", "case_number", "level", "description", "partner_id", "is_available", "teams_count"])

    def get_by_id(self, case_id: int) -> Optional[Dict[str, Any]]:
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id AND r.is_available = TRUE WHERE c.id = %s GROUP BY c.id, p.name, p.image"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (case_id,))
                return self._fetch_one_dict(cursor)
            
    def get_filtered(self, search: str = None, year: int = None, level: str = None, sort_by: str = "created_at", sort_dir: str = "desc") -> List[Dict[str, Any]]:
        allowed_sort = { "name": "c.name", "partner": "p.name", "created_at": "c.created_at", "case_number": "c.case_number" }
        sort_column = allowed_sort.get(sort_by, "c.created_at")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id AND r.is_available = TRUE WHERE c.is_available = TRUE"""
        params = []
        if search: # поиск
            query += " AND LOWER(c.name) LIKE %s"
            params.append(f"%{search.lower()}%")
        if year: # фильтр по году
            query += " AND EXTRACT(YEAR FROM c.created_at) = %s"
            params.append(year)
        if level: # фильтр по уровню
            query += " AND c.level = %s"
            params.append(level)
        query += f" GROUP BY c.id, p.name, p.image ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)
            
    def get_filtered_archived(self, search: str = None, year: int = None, level: str = None, sort_by: str = "created_at", sort_dir: str = "desc") -> List[Dict[str, Any]]:
        allowed_sort = { "name": "c.name", "partner": "p.name", "created_at": "c.created_at", "case_number": "c.case_number" }
        sort_column = allowed_sort.get(sort_by, "c.created_at")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = """SELECT c.id, c.name, c.case_number, c.level, c.description, c.partner_id, c.teams_count, c.created_at, p.name as partner_name, p.image as partner_image, c.is_available, COUNT(r.id) as registered_teams_count
            FROM cases c LEFT JOIN partners p ON c.partner_id = p.id LEFT JOIN registration r ON r.selected_case = c.id WHERE c.is_available = FALSE"""
        params = []
        if search: # поиск
            query += " AND LOWER(c.name) LIKE %s"
            params.append(f"%{search.lower()}%")
        if year: # фильтр по году
            query += " AND EXTRACT(YEAR FROM c.created_at) = %s"
            params.append(year)
        if level: # фильтр по уровню
            query += " AND c.level = %s"
            params.append(level)
        query += f" GROUP BY c.id, p.name, p.image ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)


class PartnersRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="partners", entity_class=Partner, columns=["name", "image", "description", "full_description", "site_link", "is_available"])
            
    def get_filtered(self, search: str = None, sort_by: str = "name", sort_dir: str = "asc"):
        allowed_sort = { "name": "name", "description": "description", "full_description": "full_description" }
        sort_column = allowed_sort.get(sort_by, "name")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = "SELECT id, name, image, description, full_description, site_link, created_at, is_available FROM partners WHERE is_available = TRUE"
        params = []
        if search: # поиск
            query += " AND LOWER(name) LIKE %s"
            params.append(f"%{search.lower()}%")
        query += f" ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)

    def get_filtered_archived(self, search: str = None, sort_by: str = "created_at", sort_dir: str = "desc"):
        allowed_sort = { "name": "name", "description": "description", "full_description": "full_description" }
        sort_column = allowed_sort.get(sort_by, "name")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = "SELECT id, name, image, description, full_description, site_link, created_at, is_available FROM partners WHERE is_available = FALSE"
        params = []
        if search: # поиск
            query += " AND LOWER(name) LIKE %s"
            params.append(f"%{search.lower()}%")
        query += f" ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)


class ReviewsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="reviews", entity_class=Review, columns=["name", "content", "image", "is_available"])
            
    def get_filtered(self, year: int = None):
        query = "SELECT id, name, content, image, created_at, is_available FROM reviews WHERE is_available = TRUE"
        params = []
        if year: # фильтр по году
            query += " AND EXTRACT(YEAR FROM created_at) = %s"
            params.append(year)
        query += " ORDER BY created_at DESC"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)

    def get_filtered_archived(self, year: int = None):
        query = "SELECT id, name, content, image, created_at, is_available FROM reviews WHERE is_available = FALSE"
        params = []
        if year: # фильтр по году
            query += " AND EXTRACT(YEAR FROM created_at) = %s"
            params.append(year)
        query += " ORDER BY created_at DESC"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)


class PhotoAlbumsRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="photoalbums", entity_class=PhotoAlbum, columns=["name", "is_available"])

    def get_all_with_photos(self):
        query = "SELECT id, name, created_at, is_available FROM photoalbums ORDER BY id"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        return [PhotoAlbum(r[0], r[1], r[2], r[3]) for r in rows]

    def get_by_id_with_photos(self, album_id: int):
        query = "SELECT id, name, created_at, is_available FROM photoalbums WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (album_id,))
                row = cursor.fetchone()
        if not row: return None
        return PhotoAlbum(row[0], row[1], row[2], row[3])


class PhotosRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="photos", entity_class=Photo, columns=["photoalbum_id", "path", "created_at", "is_available"])

    def get_by_album(self, album_id: int):
        query = "SELECT id, photoalbum_id, path, created_at, is_available FROM photos WHERE photoalbum_id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (album_id,))
                rows = cursor.fetchall()
        return [Photo(r[0], r[1], r[2], r[3], r[4]) for r in rows]


class RegistrationRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(connection=connection, table_name="registration", entity_class=Registration,
            columns=[ "name", "institution", "amount_participants", "participation_form", "level_education", "selected_case", "spare_case", "captain_phone", "captain_email", "curator_data", "agreement", "acquaintance", "created_at", "is_available"])

    def create_registration(self, reg: Registration, participants: list) -> int:
        query = """INSERT INTO registration 
            (name, institution, amount_participants, participation_form, level_education, selected_case, spare_case, captain_phone, captain_email, curator_data, agreement, acquaintance)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id"""
        values = (reg.name, reg.institution, reg.amount_participants, reg.participation_form, reg.level_education, reg.selected_case, reg.spare_case, reg.captain_phone, reg.captain_email, json.dumps(reg.curator_data), reg.agreement, reg.acquaintance)
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                reg_id = cursor.fetchone()[0]
                for p in participants:
                    cursor.execute("""INSERT INTO participants (fio, course, role, registration_id) VALUES (%s,%s,%s,%s)""", (p["fio"].strip(), int(p["course"]), p["role"], reg_id))
                return reg_id
            
    def get_by_id(self, reg_id: int) -> Optional[Dict[str, Any]]:
        query = """SELECT r.*, 
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
        FROM registration r LEFT JOIN participants p ON p.registration_id = r.id AND p.is_available = TRUE WHERE r.id = %s GROUP BY r.id"""

        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (reg_id,))
                return self._fetch_one_dict(cursor)
        
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
            
    def disable_registration(self, reg_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE registration SET is_available=FALSE WHERE id=%s", (reg_id,))
                cursor.execute("UPDATE participants SET is_available=FALSE WHERE registration_id=%s", (reg_id,))

    def restore_registration(self, reg_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE registration SET is_available=TRUE WHERE id=%s", (reg_id,))
                cursor.execute("UPDATE participants SET is_available=TRUE WHERE registration_id=%s", (reg_id,))

    def decrement_team_participants(self, team_id: int):
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE registration SET amount_participants = amount_participants - 1 WHERE id = %s", (team_id,))

    def increment_team_participants(self, team_id: int):
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE registration SET amount_participants = amount_participants + 1 WHERE id = %s", (team_id,))

    def create_participant(self, reg_id: int, p: dict) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""INSERT INTO participants (fio, course, role, registration_id) VALUES (%s,%s,%s,%s)""", (p["fio"].strip(), int(p["course"]), p["role"], reg_id))

    def delete_participant(self, p_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM participants WHERE id=%s", (p_id,))

    def delete_participants_by_registration(self, reg_id: int) -> None:
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM participants WHERE registration_id=%s", (reg_id,))
    
    def get_participant_by_id(self, p_id: int) -> Optional[Dict[str, Any]]:
        query = """SELECT id, fio, course, role, registration_id, created_at, is_available FROM participants WHERE id = %s AND is_available = TRUE"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (p_id,))
                row = cursor.fetchone()
                if not row: return None
                columns = [col[0] for col in cursor.description]
                return dict(zip(columns, row))
            
    def get_participants_by_registration(self, reg_id: int) -> list[dict]:
        query = """SELECT id, fio, course, role, registration_id, created_at, is_available FROM participants WHERE registration_id = %s AND is_available = TRUE ORDER BY created_at"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (reg_id,))
                rows = cursor.fetchall()
                if not rows: return []
                columns = [col[0] for col in cursor.description]
                return [dict(zip(columns, row)) for row in rows]

    def get_captain_by_registration(self, reg_id: int) -> Optional[dict]:
        query = """SELECT id, fio, course, role, registration_id FROM participants WHERE registration_id = %s AND role = 'капитан' LIMIT 1"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (reg_id,))
                row = cursor.fetchone()
                if not row: return None
                columns = [col[0] for col in cursor.description]
                return dict(zip(columns, row))

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
        query = "SELECT 1 FROM registration WHERE name = %s AND is_available = TRUE"
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
        query = "SELECT 1 FROM participants p JOIN registration r ON p.registration_id = r.id WHERE p.fio = %s AND p.course = %s AND r.is_available = TRUE"
        params = [fio, course]
        if exclude_registration_id is not None:
            query += " AND p.registration_id != %s"
            params.append(exclude_registration_id)
        query += " LIMIT 1"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone() is not None

    def get_filtered(self, search: str = None, level: str = None, case_id: int = None, sort_by: str = "created_at", sort_dir: str = "desc") -> List[Dict[str, Any]]:
        allowed_sort = { "name": "r.name", "institution": "r.institution", "level_education": "r.level_education", "selected_case": "r.selected_case", "amount_participants": "r.amount_participants", "created_at": "r.created_at" }
        sort_column = allowed_sort.get(sort_by, "r.created_at")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = f"""SELECT r.*, 
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
        FROM registration r LEFT JOIN participants p ON p.registration_id = r.id AND p.is_available = TRUE WHERE r.is_available = TRUE"""
        params = []
        if search:
            query += " AND (LOWER(r.name) LIKE %s OR LOWER(r.institution) LIKE %s)"
            params.extend([f"%{search.lower()}%", f"%{search.lower()}%"])
        if level:
            query += " AND r.level_education = %s"
            params.append(level)
        if case_id:
            query += " AND r.selected_case = %s"
            params.append(case_id)
        query += f" GROUP BY r.id ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)

    def get_filtered_archived(self, search: str = None, level: str = None, case_id: int = None, sort_by: str = "created_at", sort_dir: str = "desc") -> List[Dict[str, Any]]:
        allowed_sort = { "name": "r.name", "institution": "r.institution", "level_education": "r.level_education", "selected_case": "r.selected_case", "amount_participants": "r.amount_participants", "created_at": "r.created_at" }
        sort_column = allowed_sort.get(sort_by, "r.created_at")
        sort_direction = "ASC" if sort_dir == "asc" else "DESC"
        query = f"""SELECT r.*, 
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
        FROM registration r LEFT JOIN participants p ON p.registration_id = r.id WHERE r.is_available = FALSE"""
        params = []
        if search:
            query += " AND (LOWER(r.name) LIKE %s OR LOWER(r.institution) LIKE %s)"
            params.extend([f"%{search.lower()}%", f"%{search.lower()}%"])
        if level:
            query += " AND r.level_education = %s"
            params.append(level)
        if case_id:
            query += " AND r.selected_case = %s"
            params.append(case_id)
        query += f" GROUP BY r.id ORDER BY {sort_column} {sort_direction}"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return self._fetch_all_dict(cursor)