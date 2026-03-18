# Конфигурация приложения

import os
from typing import Optional

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:hakaton@db:5432/hakaton_db")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    @property
    def database_connection_string(self) -> str:
        return self.DATABASE_URL

settings = Settings()