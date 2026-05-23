# Сериализаторы для преобразования между JSON и сущностями

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from entities import Acquaintance, Faq, PhotoAlbum, Photo, Registration, Participant

# вход
class LoginRequest(BaseModel):
    login: str
    password: str

# обновление токена доступа
class RefreshRequest(BaseModel):
    refresh_token: str

# запрос сброса пароля
class PasswordResetRequest(BaseModel):
    email: str

# новый пароль
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

# обновление данных админа
class UpdateProfileRequest(BaseModel):
    login: Optional[str] = None
    email: Optional[str] = None


class AcquaintanceCreateSerializer(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None

class AcquaintanceSerializer(BaseModel):
    id: int
    title: Optional[str] = None
    text: Optional[str] = None

    @classmethod
    def from_entity(cls, entity: Acquaintance):
        return cls(
            id=entity.id,
            title=entity.title,
            text=entity.text)


class FaqCreateSerializer(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None

class FaqSerializer(BaseModel):
    id: int
    question: Optional[str] = None
    answer: Optional[str] = None

    @classmethod
    def from_entity(cls, entity: Faq):
        return cls(
            id=entity.id,
            question=entity.question,
            answer=entity.answer)
    

class AboutCreateSerializer(BaseModel):
    order_index: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None
    icon: Optional[str] = None

class AboutSerializer(BaseModel):
    id: int
    order_index: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None
    icon: Optional[str] = None
    created_at: Optional[datetime] = None
    

class ProgramCreateSerializer(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    text: Optional[str] = None
    order_index: Optional[int] = None

class ProgramSerializer(BaseModel):
    id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    text: Optional[str] = None
    order_index: Optional[int] = None
    created_at: Optional[datetime] = None


class CaseCreateSerializer(BaseModel):
    name: Optional[str] = None
    case_number: Optional[int] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int
    teams_count: int = 0

class CaseSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    case_number: Optional[int] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int
    partner_name: Optional[str] = None
    partner_image: Optional[str] = None
    is_available: bool = True
    teams_count: int = 0
    registered_teams_count: int = 0
    created_at: Optional[date] = None


class NewsCreateSerializer(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None

class NewsSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    image: Optional[str] = None
    created_at: Optional[datetime] = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    is_available: bool = True


class PartnerCreateSerializer(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    site_link: Optional[str] = None

class PartnerSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    site_link: Optional[str] = None
    created_at: Optional[datetime] = None
    is_available: bool = True
    

class ReviewCreateSerializer(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None

class ReviewSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    created_at: Optional[datetime] = None
    is_available: bool = True


class PhotoCreateSerializer(BaseModel):
    photo_album_id: int
    path: Optional[str] = None

class PhotoSerializer(BaseModel):
    id: int
    photoalbum_id: int
    path: Optional[str] = None
    created_at: Optional[datetime] = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Photo) -> "PhotoSerializer":
        return cls(
            id=entity.id,
            photoalbum_id=entity.photoalbum_id,
            path=entity.path,
            created_at=entity.created_at,
            is_available=entity.is_available)


class PhotoAlbumCreateSerializer(BaseModel):
    name: Optional[str] = None

class PhotoAlbumSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    created_at: Optional[datetime] = None
    is_available: bool = True
    photos: List["PhotoSerializer"] = Field(default_factory=list)

    @classmethod
    def from_entity(cls, entity: PhotoAlbum, photos=None):
        return cls(
            id=entity.id,
            name=entity.name,
            created_at=entity.created_at,
            is_available=entity.is_available,
            photos=[PhotoSerializer.from_entity(p) for p in (photos or [])])

PhotoAlbumSerializer.model_rebuild()


class ParticipantsCreateSerializer(BaseModel):
    fio: str
    course: int
    role: str

class ParticipantsSerializer(BaseModel):
    id: int
    fio: str
    course: int
    role: str
    registration_id: int
    created_at: datetime
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Participant) -> "ParticipantsSerializer":
        return cls(
            id=entity.id,
            fio=entity.fio,
            course=entity.course,
            role=entity.role,
            registration_id=entity.registration_id,
            created_at=entity.created_at,
            is_available=entity.is_available)


class RegistrationCreateSerializer(BaseModel):
    name: str
    institution: str
    amount_participants: int
    participation_form: str
    level_education: str
    selected_case: int
    spare_case: int
    captain_phone: str
    captain_email: str
    curator_data: dict # jsonb
    agreement: bool
    acquaintance: bool

class RegistrationSerializer(BaseModel):
    id: int
    name: str
    institution: str
    amount_participants: int
    participation_form: str
    level_education: str
    selected_case: int
    spare_case: int = 0
    captain_phone: str
    captain_email: str
    curator_data: dict # jsonb
    agreement: bool
    acquaintance: bool
    created_at: datetime
    is_available: bool = True
    participants: list[ParticipantsSerializer]


class RegistrationRequestSerializer(BaseModel):
    team: RegistrationCreateSerializer
    participants: list[ParticipantsCreateSerializer]

RegistrationSerializer.model_rebuild()