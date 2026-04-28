# Классы сущностей базы данных

from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime, date
from typing import Any


@dataclass
class Admin:
    id: int
    login: str
    password_hash: str
    email: str

@dataclass
class PasswordResetToken:
    id: int
    admin_id: int
    token: str
    expires_at: datetime
    used: bool

@dataclass
class Acquaintance:
    id: int = None
    title: Optional[str] = None
    text: Optional[str] = None

@dataclass
class Program:
    id: int = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    text: Optional[str] = None
    order_index: Optional[int] = None
    created_at: Optional[datetime] = None

@dataclass
class About:
    id: int = None
    row: Optional[int] = None
    col: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None
    icon: Optional[str] = None
    created_at: Optional[datetime] = None

@dataclass
class Case:
    id: int = None
    name: Optional[str] = None
    case_number: Optional[int] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int = 0
    is_available: bool = True
    teams_count: int = 0
    created_at: date = None

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
    image: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    site_link: Optional[str] = None
    created_at: datetime = None
    is_available: bool = True

@dataclass
class PhotoAlbum:
    id: int = None
    name: Optional[str] = None
    created_at: datetime = None
    is_available: bool = True

@dataclass
class Photo:
    id: int = None
    photoalbum_id: int = 0
    path: Optional[str] = None
    created_at: datetime = None
    is_available: bool = True

@dataclass
class PhotoAlbumWithPhotos:
    album: PhotoAlbum
    photos: List[Photo]

@dataclass
class Review:
    id: int = None
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = None
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
    curator_data: dict = None # jsonb
    agreement: bool = None
    acquaintance: bool = None
    created_at: datetime = None
    is_available: bool = True

@dataclass
class Participant:
    id: int = None
    fio: str = None
    course: int = 0
    role: str =None
    registration_id: int = 0
    created_at: datetime = None
    is_available: bool = True