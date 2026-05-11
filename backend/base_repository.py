from typing import Callable, Type, TypeVar, List, Optional, Dict, Any
from psycopg2.extensions import connection

T = TypeVar("T") # тип сущности

class BaseRepository:
    def __init__(self, connection: Callable[[], connection], table_name: str, entity_class: Type[T], columns: List[str], has_is_available=True):
        self.connection = connection
        self.table_name = table_name
        self.entity_class = entity_class
        self.columns = columns
        self.has_is_available = has_is_available

    def _fetch_all_dict(self, cursor) -> List[Dict[str, Any]]:
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def _fetch_one_dict(self, cursor) -> Optional[Dict[str, Any]]:
        row = cursor.fetchone()
        if not row: return None
        columns = [col[0] for col in cursor.description]
        return dict(zip(columns, row))

    def create(self, entity: T) -> int:
        fields = ",".join(self.columns)
        placeholders = ",".join(["%s"] * len(self.columns))
        values = [getattr(entity, col) for col in self.columns]
        query = f"INSERT INTO {self.table_name} ({fields}) VALUES ({placeholders}) RETURNING id"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                entity_id = cursor.fetchone()[0]
        return entity_id
    
    def update(self, entity_id: int, entity: T) -> None:
        set_clause = ", ".join([f"{col}=%s" for col in self.columns])
        values = [getattr(entity, col) for col in self.columns] + [entity_id]
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
    
    def get_all(self) -> List[T]:
        query = f"SELECT id,{','.join(self.columns)} FROM {self.table_name}"
        if self.has_is_available:
            query += " WHERE is_available = TRUE"
        query += " ORDER BY id"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        return [self.entity_class(*row) for row in rows]

    def get_by_id(self, entity_id: int) -> Optional[T]:
        query = f"SELECT id,{','.join(self.columns)} FROM {self.table_name} WHERE id = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))
                row = cursor.fetchone()
        if not row: return None
        return self.entity_class(*row)
    
    def get_by_id_dict(self, entity_id: int):
        query = f"SELECT id,{','.join(self.columns)} FROM {self.table_name} WHERE id = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))
                return self._fetch_one_dict(cursor)
        
    def delete(self, entity_id: int) -> None:
        query = f"DELETE FROM {self.table_name} WHERE id=%s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))

    def disable(self, entity_id: int) -> None:
        query = f"UPDATE {self.table_name} SET is_available = FALSE WHERE id = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))
    
    def restore(self, entity_id: int) -> None:
        query = f"UPDATE {self.table_name} SET is_available = TRUE WHERE id = %s"
        with self.connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, (entity_id,))