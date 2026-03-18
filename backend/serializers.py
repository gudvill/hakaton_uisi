# Сериализаторы для преобразования между JSON и сущностями

from pydantic import BaseModel
from typing import Optional
from datetime import date
from entities import Main, Admin, Cases, News, Partners, PhotoAlbum, Photo, Reviews, Registration, Participants


class MainSerializer(BaseModel):
    pass


class AdminSerializer(BaseModel):
    pass


class CasesCreateSerializer(BaseModel):
    name: Optional[str] = None
    case_number: Optional[int] = None
    image: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int
    role: Optional[str] = None


class CasesSerializer(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    case_number: Optional[int] = 0
    image: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    partner_id: int
    role: Optional[str] = None
    status: bool = True

    @classmethod
    def from_entity(cls, entity: Cases) -> "CasesSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            case_number=entity.case_number,
            image=entity.image,
            level=entity.level,
            description=entity.description,
            partner_id=entity.partner_id,
            role=entity.role,
            status=entity.status)


class NewsCreateSerializer(BaseModel):
    name: Optional[str] = None
    image: Optional[int] = None
    created_at: date = None
    brief_description: Optional[str] = None
    full_description: Optional[str] = None


class NewsSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
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


class PartnersSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Partners) -> "PartnersSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            description=entity.description,
            image=entity.image,
            created_at=entity.created_at,
            is_available=entity.is_available)
    

class PhotoAlbumSerializer(BaseModel):
    id: int
    image: Optional[str] = None
    created_at: date = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: PhotoAlbum) -> "PhotoAlbumSerializer":
        return cls(
            id=entity.id,
            image=entity.image,
            created_at=entity.created_at,
            is_available=entity.is_available)


class PhotoSerializer(BaseModel):
    id: int
    photo_album_id: int
    path: Optional[str] = None
    created_at: date = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Photo) -> "PhotoSerializer":
        return cls(
            id=entity.id,
            photo_album_id=entity.photo_album_id,
            path=entity.path,
            created_at=entity.created_at,
            is_available=entity.is_available)


class ReviewsSerializer(BaseModel):
    id: int
    name: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    created_at: date = None
    is_available: bool = True

    @classmethod
    def from_entity(cls, entity: Reviews) -> "ReviewsSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            content=entity.content,
            image=entity.image,
            created_at=entity.created_at,
            is_available=entity.is_available)


class RegistrationSerializer(BaseModel):
    id: int
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
    status: bool = True

    @classmethod
    def from_entity(cls, entity: Registration) -> "RegistrationSerializer":
        return cls(
            id=entity.id,
            name=entity.name,
            institution=entity.institution,
            amount_participants=entity.amount_participants,
            participation_form=entity.participation_form,
            level_education=entity.level_education,
            selected_case=entity.selected_case,
            spare_case=entity.spare_case,
            captain_phone=entity.captain_phone,
            captain_email=entity.captain_email,
            curator_data=entity.curator_data,
            agreement=entity.agreement,
            acquaintance=entity.acquaintance,
            created_at=entity.created_at,
            status=entity.status)


class ParticipantsSerializer(BaseModel):
    id: int
    fio: str = None
    course: int = 0
    role: str =None
    registration_id: int
    created_at: date = None
    status: bool = True

    @classmethod
    def from_entity(cls, entity: Participants) -> "ParticipantsSerializer":
        return cls(
            id=entity.id,
            fio=entity.fio,
            course=entity.course,
            role=entity.role,
            registration_id=entity.registration_id,
            created_at=entity.created_at,
            status=entity.status)