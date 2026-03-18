# Классы сущностей базы данных

from dataclasses import dataclass
from typing import Optional, List
from datetime import date
from typing import Any


@dataclass
class Main:
    pass

@dataclass
class Admin:
    pass

@dataclass
class Case:
    id: int = None
    name: Optional[str] = None
    case_number: Optional[int] = 0
    image: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int
    role: Optional[str] = None
    is_available: bool = True

@dataclass
class News:
    id: int = None
    name: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    is_available: bool = True

@dataclass
class Partner:
    id: int = None
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
    is_available: bool = True

@dataclass
class PhotoAlbum:
    id: int = None
    image: Optional[str] = None
    created_at: date = None
    is_available: bool = True

@dataclass
class Photo:
    id: int = None
    photo_album_id: int
    path: Optional[str] = None
    created_at: date = None
    is_available: bool = True

@dataclass
class Review:
    id: int = None
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
    is_available: bool = True

@dataclass
class Registration:
    id: int = None
    name: str = None
    institution: str = None
    amount_participants: int = 0
    participation_form: str = None
    level_education: str = None
    selected_case: int = 0
    spare_case: int = 0
    captain_phone: str = None
    captain_email: str = None
    curator_data: str = None # jsonb
    agreement: bool = None
    acquaintance: bool = None
    created_at: date = None
    is_available: bool = True

@dataclass
class Participant:
    id: int = None
    fio: str = None
    course: int = 0
    role: str =None
    registration_id: int
    created_at: date = None
    is_available: bool = True