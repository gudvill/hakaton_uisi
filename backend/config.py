# Конфигурация приложения

import os
from typing import Optional

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    if not DATABASE_URL: raise ValueError("DATABASE_URL не задан")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    @property
    def database_connection_string(self) -> str:
        return self.DATABASE_URL

settings = Settings()