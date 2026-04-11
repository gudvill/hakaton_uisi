# Сериализаторы для преобразования между JSON и сущностями

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from entities import Admin, Acquaintance, Program, About, Case, News, Partner, PhotoAlbum, Photo, Review, Registration, Participant


class LoginRequest(BaseModel):
    login: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

# запрос сброса пароля
class PasswordResetRequest(BaseModel):
    email: str

# новый пароль
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


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
    created_at: datetime = None

    @classmethod
    def from_entity(cls, entity: Program):
        return cls(
            id=entity.id,
            start_date=entity.start_date,
            end_date=entity.end_date,
            text=entity.text,
            order_index=entity.order_index,
            created_at=entity.created_at)

class AboutCreateSerializer(BaseModel):
    row: Optional[int] = None
    col: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime = None

class AboutSerializer(BaseModel):
    id: int
    row: Optional[int] = None
    col: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime = None

    @classmethod
    def from_entity(cls, entity: About):
        return cls(
            id=entity.id,
            row=entity.row,
            col=entity.col,
            title=entity.title,
            text=entity.text,
            icon=entity.icon,
            created_at=entity.created_at)


class CaseCreateSerializer(BaseModel):
    name: Optional[str] = None
    case_number: Optional[int] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int

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


class NewsCreateSerializer(BaseModel):
    name: Optional[str] = None
    image: Optional[int] = None
    created_at: datetime = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None

class NewsSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: News) -> "NewsSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            image=entity.image,
            created_at=entity.created_at,
            brief_description=entity.brief_description,
            full_description=entity.full_description,
            is_available=entity.is_available)


class PartnerCreateSerializer(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    site_link: Optional[str] = None
    created_at: datetime = None

class PartnerSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    site_link: Optional[str] = None
    created_at: datetime = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Partner) -> "PartnerSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            image=entity.image,
            description=entity.description,
            full_description=entity.full_description,
            site_link=entity.site_link,
            created_at=entity.created_at,
            is_available=entity.is_available)
    

class PhotoCreateSerializer(BaseModel):
    photo_album_id: int
    path: Optional[str] = None
    created_at: datetime = None

class PhotoSerializer(BaseModel):
    id: int
    photoalbum_id: int
    path: Optional[str] = None
    created_at: datetime = None
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
    image: Optional[str] = None
    created_at: datetime = None

class PhotoAlbumSerializer(BaseModel):
    id: int
    image: Optional[str] = None
    created_at: datetime = None
    is_available: bool = True
    photos: List["PhotoSerializer"] = Field(default_factory=list)

    @classmethod
    def from_entity(cls, entity: PhotoAlbum, photos: List["Photo"] | None = None):
        return cls(
            id=entity.id,
            image=entity.image,
            created_at=entity.created_at,
            is_available=entity.is_available,
            photos=[PhotoSerializer.from_entity(p) for p in (photos or [])])

PhotoAlbumSerializer.model_rebuild()


class ReviewCreateSerializer(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = None

class ReviewSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Review) -> "ReviewSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            content=entity.content,
            image=entity.image,
            created_at=entity.created_at,
            is_available=entity.is_available)


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