# Репозиторий для работы с базой данных (SQL запросы к БД)

from base_repository import BaseRepository
from entities import Cases, News

class CasesRepository(BaseRepository):
    def __init__(self, connection):
        super().__init__(
            connection=connection,
            table_name="cases",
            entity_class=Cases,
            columns=["name", "case_number", "image", "level", "description", "partner_id", "role", "status"])
    
    def update(self, case_id: int, case: Cases) -> None:
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
            columns=["name", "image", "created_at", "brief_description", "full_description"])
    
    def update(self, news_id: int, news: News) -> None:
        query = """UPDATE cases
            SET name=%s, image=%s, created_at=%s, brief_description=%s, full_description=%s WHERE id=%s"""
        values = [news.name, news.image, news.created_at, news.brief_description, news.full_description, news_id]
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)