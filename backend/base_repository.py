from typing import Callable, Type, TypeVar, List, Optional
from psycopg2.extensions import connection

T = TypeVar("T") # тип сущности

class BaseRepository:
    def __init__(self, connection: Callable[[], connection], table_name: str, entity_class: Type[T], columns: List[str]):
        self.connection = connection
        self.table_name = table_name
        self.entity_class = entity_class
        self.columns = columns

    def create(self, entity: T) -> int:
        fields = ",".join(self.columns)
        placeholders = ",".join(["%s"] * len(self.columns))
        values = [getattr(entity, col) for col in self.columns]
        query = f"""INSERT INTO {self.table_name} ({fields}) VALUES ({placeholders}) RETURNING id"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                entity_id = cursor.fetchone()[0]
        return entity_id

    def get_all(self) -> List[T]:
        query = f"""SELECT id,{",".join(self.columns)} FROM {self.table_name} WHERE status = TRUE ORDER BY id"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        return [self.entity_class(*row) for row in rows]

    def get_by_id(self, entity_id: int) -> Optional[T]:
        query = f"""SELECT id,{",".join(self.columns)} FROM {self.table_name} WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))
                row = cursor.fetchone()
        if not row: return None
        return self.entity_class(*row)

    def disable(self, entity_id: int) -> None:
        query = f"""UPDATE {self.table_name} SET is_available = FALSE WHERE id = %s"""
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))