# Классы сущностей базы данных

from dataclasses import dataclass
from typing import Optional, List
from datetime import date
from typing import Any


@dataclass
class Cases:
    id: int
    name: Optional[str] = None
    case_number: Optional[int] = 0
    image: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner: Optional[str] = None

@dataclass
class News:
    id: int
    name: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None

@dataclass
class Reviews:
    id: int
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None

@dataclass
class Partners:
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

@dataclass
class Registration:
    id: int
    name: str = None
    institution: str = None
    amount_participants: int = 0
    participation_form: str = None
	#participants = ???
    selected_case: int = 0
    captain_phone: str = None
    captain_email: str = None
	#team_curator = ???
    agreement: bool = None
    acquaintance: bool = None

@dataclass
class PhotoAlbum:
    id: int
    image: Optional[str] = None
    created_at: date = None