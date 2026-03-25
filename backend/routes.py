from fastapi import APIRouter, HTTPException, Depends
from typing import List
from jose import jwt, JWTError
from security import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from entities import Main, Admin, Case, News, Partner, PhotoAlbum, Photo, Review, Registration, Participant
from serializers import (LoginRequest, RefreshRequest,
                         CaseSerializer, CaseCreateSerializer,
                         NewsSerializer, NewsCreateSerializer,
                         PartnerSerializer, PartnerCreateSerializer,
                         PhotoAlbumSerializer, PhotoAlbumCreateSerializer,
                         PhotoSerializer, PhotoCreateSerializer,
                         ReviewSerializer, ReviewCreateSerializer)
from use_cases import AdminUseCase, CasesUseCase, NewsUseCase, PartnersUseCase, PhotoAlbumsUseCase, PhotosUseCase, ReviewsUseCase
from dependencies import (get_current_admin, get_admin_usecase,
                          get_cases_usecase, get_news_usecase,
                          get_partners_usecase, get_photoalbums_usecase,
                          get_photos_usecase, get_reviews_usecase)

admin_router = APIRouter(prefix="/admin", tags=["admin"])
cases_router = APIRouter(prefix="/cases", tags=["cases"])
news_router = APIRouter(prefix="/news", tags=["news"])
partners_router = APIRouter(prefix="/partners", tags=["partners"])
photoalbums_router = APIRouter(prefix="/photoalbums", tags=["photoalbums"])
photos_router = APIRouter(prefix="/photos", tags=["photos"])
reviews_router = APIRouter(prefix="/reviews", tags=["reviews"])


# Эндпоинты для Админа
@admin_router.post("/login")
def login(admin_data: LoginRequest, use_case: AdminUseCase = Depends(get_admin_usecase)):
    user = use_case.login(admin_data.login, admin_data.password)
    if not user: raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    access = create_access_token({"sub": str(user["id"])})
    refresh = create_refresh_token({"sub": str(user["id"])})
    return {
        "access_token": access,
        "refresh_token": refresh
    }

@admin_router.post("/refresh")
def refresh_token(data: RefreshRequest):
    try:
        payload = jwt.decode(data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    new_access = create_access_token({"sub": user_id})
    return {"access_token": new_access}


# Эндпоинты для Кейсов
@cases_router.post("/", response_model=CaseSerializer)
def create_case(case_data: CaseCreateSerializer, use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)) -> CaseSerializer:
    case = Case(
        id=0,
        name=case_data.name,
        case_number=case_data.case_number,
        level=case_data.level,
        description=case_data.description,
        partner_id=case_data.partner_id,
        is_available=True)
    case_id = use_case.create(case)
    created = use_case.get_by_id(case_id)
    return CaseSerializer(**created)

@cases_router.get("/", response_model=List[CaseSerializer])
def get_cases(use_case: CasesUseCase = Depends(get_cases_usecase)):
    return [CaseSerializer(**row) for row in use_case.get_all()]

@cases_router.get("/{case_id}", response_model=CaseSerializer)
def get_case(case_id: int, use_case: CasesUseCase = Depends(get_cases_usecase)):
    row = use_case.get_by_id(case_id)
    if not row: raise HTTPException(status_code=404, detail="Кейс не найден")
    return CaseSerializer(**row)

@cases_router.put("/{case_id}", response_model=CaseSerializer)
def update_case(case_id: int, case_data: CaseCreateSerializer, use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)) -> CaseSerializer:
    case = Case(
        id=case_id,
        name=case_data.name,
        case_number=case_data.case_number,
        level=case_data.level,
        description=case_data.description,
        partner_id=case_data.partner_id)
    use_case.update(case_id, case)
    updated = use_case.get_by_id(case_id)
    return CaseSerializer(**updated)

@cases_router.delete("/{case_id}")
def disable_case(case_id: int, use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)):
    use_case.disable(case_id)
    return {"message": "Кейс отключён"}


# Эндпоинты для Новостей
@news_router.post("/", response_model=NewsSerializer)
def create_news(news_data: NewsCreateSerializer, use_case: NewsUseCase = Depends(get_news_usecase), admin=Depends(get_current_admin)) -> NewsSerializer:
    news = News(
        id=0,
        name=news_data.name,
        image=news_data.image,
        created_at=news_data.created_at,
        brief_description=news_data.brief_description,
        full_description=news_data.full_description,
        is_available=True)
    news_id = use_case.create(news)
    news.id = news_id
    return NewsSerializer.from_entity(news)

@news_router.get("/", response_model=List[NewsSerializer])
def get_news(use_case: NewsUseCase = Depends(get_news_usecase)) -> List[NewsSerializer]:
    news = use_case.get_all()
    return [NewsSerializer.from_entity(c) for c in news]

@news_router.get("/{news_id}", response_model=NewsSerializer)
def get_news(news_id: int, use_case: NewsUseCase = Depends(get_news_usecase)) -> NewsSerializer:
    news = use_case.get_by_id(news_id)
    if not news: raise HTTPException(status_code=404, detail="Новость не найдена")
    return NewsSerializer.from_entity(news)

@news_router.put("/{news_id}", response_model=NewsSerializer)
def update_news(news_id: int, news_data: NewsCreateSerializer, use_case: NewsUseCase = Depends(get_news_usecase), admin=Depends(get_current_admin)) -> NewsSerializer:
    news = News(
        id=news_id,
        name=news_data.name,
        image=news_data.image,
        created_at=news_data.created_at,
        brief_description=news_data.brief_description,
        full_description=news_data.full_description)
    use_case.update(news_id, news)
    updated_news = use_case.get_by_id(news_id)
    return NewsSerializer.from_entity(updated_news)

@news_router.delete("/{news_id}")
def disable_news(news_id: int, use_case: NewsUseCase = Depends(get_news_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(news_id)
    return {"message": "Новость отключена"}


# Эндпоинты для Партнёров
@partners_router.post("/", response_model=PartnerSerializer)
def create_partner(partner_data: PartnerCreateSerializer, use_case: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)) -> PartnerSerializer:
    partner = Partner(
        id=0,
        name=partner_data.name,
        description=partner_data.description,
        image=partner_data.image,
        created_at=partner_data.created_at,
        is_available=True)
    partner_id = use_case.create(partner)
    partner.id = partner_id
    return PartnerSerializer.from_entity(partner)

@partners_router.get("/", response_model=List[PartnerSerializer])
def get_partners(use_case: PartnersUseCase = Depends(get_partners_usecase)) -> List[PartnerSerializer]:
    partners = use_case.get_all()
    return [PartnerSerializer.from_entity(c) for c in partners]

@partners_router.get("/{partner_id}", response_model=PartnerSerializer)
def get_partner(partner_id: int, use_case: PartnersUseCase = Depends(get_partners_usecase)) -> PartnerSerializer:
    partner = use_case.get_by_id(partner_id)
    if not partner: raise HTTPException(status_code=404, detail="Партнёр не найден")
    return PartnerSerializer.from_entity(partner)

@partners_router.put("/{partner_id}", response_model=PartnerSerializer)
def update_partner(partner_id: int, partner_data: PartnerCreateSerializer, use_case: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)) -> PartnerSerializer:
    partner = Partner(
        id=partner_id,
        name=partner_data.name,
        description=partner_data.description,
        image=partner_data.image,
        created_at=partner_data.created_at)
    use_case.update(partner_id, partner)
    updated_partner = use_case.get_by_id(partner_id)
    return PartnerSerializer.from_entity(updated_partner)

@partners_router.delete("/{partner_id}")
def disable_partner(partner_id: int, use_case: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(partner_id)
    return {"message": "Партнёр отключён"}


# Эндпоинты для ФотоАльбомов
@photoalbums_router.post("/", response_model=PhotoAlbumSerializer)
def create_photoalbum(photoalbum_data: PhotoAlbumCreateSerializer, use_case: PhotoAlbumsUseCase = Depends(get_photoalbums_usecase), admin=Depends(get_current_admin)) -> PhotoAlbumSerializer:
    photoalbum = PhotoAlbum(
        id=0,
        image=photoalbum_data.image,
        created_at=photoalbum_data.created_at,
        is_available=True)
    photoalbum_id = use_case.create(photoalbum)
    photoalbum.id = photoalbum_id
    return PhotoAlbumSerializer.from_entity(photoalbum)

@photoalbums_router.get("/", response_model=List[PhotoAlbumSerializer])
def get_photoalbums(use_case: PhotoAlbumsUseCase = Depends(get_photoalbums_usecase)) -> List[PhotoAlbumSerializer]:
    photoalbums = use_case.get_all()
    return [PhotoAlbumSerializer.from_entity(c) for c in photoalbums]

@photoalbums_router.get("/{photoalbum_id}", response_model=PhotoAlbumSerializer)
def get_photoalbum(photoalbum_id: int, use_case: PhotoAlbumsUseCase = Depends(get_photoalbums_usecase)) -> PhotoAlbumSerializer:
    photoalbum = use_case.get_by_id(photoalbum_id)
    if not photoalbum: raise HTTPException(status_code=404, detail="Фотоальбом не найден")
    return PhotoAlbumSerializer.from_entity(photoalbum)

@photoalbums_router.put("/{photoalbum_id}", response_model=PhotoAlbumSerializer)
def update_photoalbum(photoalbum_id: int, photoalbum_data: PhotoAlbumCreateSerializer, use_case: PhotoAlbumsUseCase = Depends(get_photoalbums_usecase), admin=Depends(get_current_admin)) -> PhotoAlbumSerializer:
    photoalbum = PhotoAlbum(
        id=photoalbum_id,
        image=photoalbum_data.image,
        created_at=photoalbum_data.created_at)
    use_case.update(photoalbum_id, photoalbum)
    updated_photoalbum = use_case.get_by_id(photoalbum_id)
    return PhotoAlbumSerializer.from_entity(updated_photoalbum)

@photoalbums_router.delete("/{photoalbum_id}")
def disable_photoalbum(photoalbum_id: int, use_case: PhotoAlbumsUseCase = Depends(get_photoalbums_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(photoalbum_id)
    return {"message": "Фотоальбом отключён"}


# Эндпоинты для Фото
@photos_router.post("/", response_model=PhotoSerializer)
def create_photo(photo_data: PhotoCreateSerializer, use_case: PhotosUseCase = Depends(get_photos_usecase), admin=Depends(get_current_admin)) -> PhotoSerializer:
    photo = Photo(
        id=0,
        photo_album_id=photo_data.photo_album_id,
        path=photo_data.path,
        created_at=photo_data.created_at,
        is_available=True)
    photo_id = use_case.create(photo)
    photo.id = photo_id
    return PhotoSerializer.from_entity(photo)

@photos_router.get("/", response_model=List[PhotoSerializer])
def get_photos(use_case: PhotosUseCase = Depends(get_photos_usecase)) -> List[PhotoSerializer]:
    photos = use_case.get_all()
    return [PhotoSerializer.from_entity(c) for c in photos]

@photos_router.get("/{photo_id}", response_model=PhotoSerializer)
def get_photo(photo_id: int, use_case: PhotosUseCase = Depends(get_photos_usecase)) -> PhotoSerializer:
    photo = use_case.get_by_id(photo_id)
    if not photo: raise HTTPException(status_code=404, detail="Фото не найдено")
    return PhotoSerializer.from_entity(photo)

@photos_router.put("/{photo_id}", response_model=PhotoSerializer)
def update_photo(photo_id: int, photo_data: PhotoCreateSerializer, use_case: PhotosUseCase = Depends(get_photos_usecase), admin=Depends(get_current_admin)) -> PhotoSerializer:
    photo = Photo(
        id=photo_id,
        photo_album_id=photo_data.photo_album_id,
        path=photo_data.path,
        created_at=photo_data.created_at)
    use_case.update(photo_id, photo)
    updated_photo = use_case.get_by_id(photo_id)
    return PhotoSerializer.from_entity(updated_photo)

@photos_router.delete("/{photo_id}")
def disable_photo(photo_id: int, use_case: PhotosUseCase = Depends(get_photos_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(photo_id)
    return {"message": "Фото отключено"}


# Эндпоинты для Отзывов
@reviews_router.post("/", response_model=ReviewSerializer)
def create_review(review_data: ReviewCreateSerializer, use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin=Depends(get_current_admin)) -> ReviewSerializer:
    review = Review(
        id=0,
        name=review_data.name,
        content=review_data.content,
        image=review_data.image,
        created_at=review_data.created_at,
        is_available=True)
    review_id = use_case.create(review)
    review.id = review_id
    return ReviewSerializer.from_entity(review)

@reviews_router.get("/", response_model=List[ReviewSerializer])
def get_reviews(use_case: ReviewsUseCase = Depends(get_reviews_usecase)) -> List[ReviewSerializer]:
    reviews = use_case.get_all()
    return [ReviewSerializer.from_entity(c) for c in reviews]

@reviews_router.get("/{review_id}", response_model=ReviewSerializer)
def get_review(review_id: int, use_case: ReviewsUseCase = Depends(get_reviews_usecase)) -> ReviewSerializer:
    review = use_case.get_by_id(review_id)
    if not review: raise HTTPException(status_code=404, detail="Отзыв не найден")
    return ReviewSerializer.from_entity(review)

@reviews_router.put("/{review_id}", response_model=ReviewSerializer)
def update_review(review_id: int, review_data: ReviewCreateSerializer, use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin=Depends(get_current_admin)) -> ReviewSerializer:
    review = Review(
        id=review_id,
        name=review_data.name,
        content=review_data.content,
        image=review_data.image,
        created_at=review_data.created_at)
    use_case.update(review_id, review)
    updated_review = use_case.get_by_id(review_id)
    return ReviewSerializer.from_entity(updated_review)

@reviews_router.delete("/{review_id}")
def disable_review(review_id: int, use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(review_id)
    return {"message": "Отзыв отключён"}