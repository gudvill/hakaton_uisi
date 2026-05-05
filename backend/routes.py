from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, UploadFile, File, Form
from typing import List
from jose import jwt, JWTError
from security import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from utils import send_reset_email
import uuid
import os
from datetime import datetime
from typing import Optional
from pathlib import Path
UPLOAD_DIR = "media/albums"
from entities import Admin, Acquaintance, Faq, Program, About, Case, News, Partner, PhotoAlbum, Photo, Review, Registration, Participant
from serializers import (PasswordResetRequest,ResetPasswordRequest,
                         LoginRequest, RefreshRequest, UpdateProfileRequest,
                         AcquaintanceSerializer, AcquaintanceCreateSerializer,
                         FaqSerializer, FaqCreateSerializer, 
                         ProgramSerializer, ProgramCreateSerializer,
                         AboutSerializer, AboutCreateSerializer,
                         CaseSerializer, CaseCreateSerializer,
                         NewsSerializer, NewsCreateSerializer,
                         PartnerSerializer, PartnerCreateSerializer,
                         PhotoAlbumSerializer, PhotoAlbumCreateSerializer,
                         PhotoSerializer, PhotoCreateSerializer,
                         ReviewSerializer, ReviewCreateSerializer,
                         RegistrationSerializer, RegistrationRequestSerializer,
                         ParticipantsCreateSerializer)
from use_cases import AdminUseCase, AcquaintanceUseCase, FaqUseCase, ProgramUseCase, AboutUseCase, CasesUseCase, NewsUseCase, PartnersUseCase, PhotoAlbumsUseCase, PhotosUseCase, ReviewsUseCase, RegistrationUseCase
from dependencies import (get_current_admin, get_admin_usecase,
                          get_acquaintance_usecase, get_faq_usecase,
                          get_program_usecase, get_about_usecase,
                          get_cases_usecase, get_news_usecase,
                          get_partners_usecase, get_photoalbums_usecase,
                          get_photos_usecase, get_reviews_usecase,
                          get_registration_usecase)

admin_router = APIRouter(prefix="/admin", tags=["admin"])
acquaintance_router = APIRouter(prefix="/acquaintance", tags=["acquaintance"])
faq_router = APIRouter(prefix="/faq", tags=["faq"])
program_router = APIRouter(prefix="/program", tags=["program"])
about_router = APIRouter(prefix="/about", tags=["about"])
cases_router = APIRouter(prefix="/cases", tags=["cases"])
news_router = APIRouter(prefix="/news", tags=["news"])
partners_router = APIRouter(prefix="/partners", tags=["partners"])
photoalbums_router = APIRouter(prefix="/photoalbums", tags=["photoalbums"])
photos_router = APIRouter(prefix="/photos", tags=["photos"])
reviews_router = APIRouter(prefix="/reviews", tags=["reviews"])
registration_router = APIRouter(prefix="/registration", tags=["registration"])


# Эндпоинты для Админа
@admin_router.get("/me")
def get_me(current_admin=Depends(get_current_admin), use_case: AdminUseCase = Depends(get_admin_usecase)):
    return use_case.get_me(int(current_admin))

@admin_router.put("/update-profile")
def update_profile(data: UpdateProfileRequest, current_admin=Depends(get_current_admin), use_case: AdminUseCase = Depends(get_admin_usecase)):
    return use_case.update_profile(int(current_admin), data.login, data.email)

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

@admin_router.post("/request-password-reset")
def request_password_reset(request: PasswordResetRequest, use_case: AdminUseCase = Depends(get_admin_usecase)):
    token = use_case.request_password_reset(request.email)
    if token:
        reset_link = f"http://hakaton1.bizml.ru/reset-password?token={token}"
        send_reset_email(request.email, reset_link)
    return {"message": "Если такой e-mail существует, ссылка отправлена"}
    
@admin_router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, use_case: AdminUseCase = Depends(get_admin_usecase)):
    try:
        use_case.reset_password(request.token, request.new_password, request.confirm_password)
        return {"message": "Пароль успешно изменён"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Эндпоинты для Ознакомлений
@acquaintance_router.post("/", response_model=AcquaintanceSerializer)
def create_acquaintance(item_data: AcquaintanceCreateSerializer, use_case: AcquaintanceUseCase = Depends(get_acquaintance_usecase), admin=Depends(get_current_admin)):
    item = Acquaintance(id=0, title=item_data.title, text=item_data.text)
    item_id = use_case.create(item)
    created = use_case.get_by_id(item_id)
    return AcquaintanceSerializer.from_entity(created)

@acquaintance_router.get("/", response_model=List[AcquaintanceSerializer])
def get_acquaintances(use_case: AcquaintanceUseCase = Depends(get_acquaintance_usecase)):
    return [AcquaintanceSerializer.from_entity(x) for x in use_case.get_all()]

@acquaintance_router.get("/{item_id}", response_model=AcquaintanceSerializer)
def get_acquaintance(item_id: int, use_case: AcquaintanceUseCase = Depends(get_acquaintance_usecase)):
    item = use_case.get_by_id(item_id)
    if not item: raise HTTPException(status_code=404, detail="Не найдено")
    return AcquaintanceSerializer.from_entity(item)

@acquaintance_router.put("/{item_id}", response_model=AcquaintanceSerializer)
def update_acquaintance(item_id: int, item_data: AcquaintanceCreateSerializer, use_case: AcquaintanceUseCase = Depends(get_acquaintance_usecase), admin=Depends(get_current_admin)):
    item = Acquaintance(id=item_id, title=item_data.title, text=item_data.text)
    use_case.update(item_id, item)
    updated = use_case.get_by_id(item_id)
    return AcquaintanceSerializer.from_entity(updated)


# Эндпоинты для Faq
@faq_router.post("/", response_model=FaqSerializer)
def create_faq(item_data: FaqCreateSerializer, use_case: FaqUseCase = Depends(get_faq_usecase), admin=Depends(get_current_admin)):
    item = Faq(id=0, question=item_data.question, answer=item_data.answer)
    item_id = use_case.create(item)
    created = use_case.get_by_id(item_id)
    return FaqSerializer.from_entity(created)

@faq_router.get("/", response_model=List[FaqSerializer])
def get_faq(use_case: FaqUseCase = Depends(get_faq_usecase)):
    return [FaqSerializer.from_entity(x) for x in use_case.get_all()]

@faq_router.get("/{item_id}", response_model=FaqSerializer)
def get_faq(item_id: int, use_case: FaqUseCase = Depends(get_faq_usecase)):
    item = use_case.get_by_id(item_id)
    if not item: raise HTTPException(status_code=404, detail="Не найдено")
    return FaqSerializer.from_entity(item)

@faq_router.put("/{item_id}", response_model=FaqSerializer)
def update_faq(item_id: int, item_data: FaqCreateSerializer, use_case: FaqUseCase = Depends(get_faq_usecase), admin=Depends(get_current_admin)):
    item = Faq(id=item_id, question=item_data.question, answer=item_data.answer)
    use_case.update(item_id, item)
    updated = use_case.get_by_id(item_id)
    return FaqSerializer.from_entity(updated)

@faq_router.delete("/{item_id}")
def delete_faq(item_id: int, use_case: FaqUseCase = Depends(get_faq_usecase), admin=Depends(get_current_admin)):
    use_case.delete(item_id)
    return {"message": "Удалено"}


# Эндпоинты для Описания
@about_router.post("/", response_model=AboutSerializer)
async def create_about(row: Optional[int] = Form(None), col: Optional[int] = Form(None), title: Optional[str] = Form(None), text: Optional[str] = Form(None), file: UploadFile = File(None), use_case: AboutUseCase = Depends(get_about_usecase), admin=Depends(get_current_admin)):
    icon_path = None
    if file:
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/about") / filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
        icon_path = f"/media/about/{filename}"
    item = About(id=0, row=row, col=col, title=title, text=text, icon=icon_path)
    item_id = use_case.create(item)
    created = use_case.get_by_id(item_id)
    return AboutSerializer(**created)

@about_router.get("/", response_model=List[AboutSerializer])
def get_about(use_case: AboutUseCase = Depends(get_about_usecase)):
    return [AboutSerializer(**row) for row in use_case.get_all()]

@about_router.get("/{item_id}", response_model=AboutSerializer)
def get_about_item(item_id: int, use_case: AboutUseCase = Depends(get_about_usecase)):
    item = use_case.get_by_id(item_id)
    if not item: raise HTTPException(status_code=404, detail="Не найдено")
    return AboutSerializer(**item)

@about_router.put("/{item_id}", response_model=AboutSerializer)
async def update_about(item_id: int, row: Optional[int] = Form(None), col: Optional[int] = Form(None), title: Optional[str] = Form(None), text: Optional[str] = Form(None), file: UploadFile = File(None), use_case: AboutUseCase = Depends(get_about_usecase), admin=Depends(get_current_admin)):
    existing = use_case.get_by_id(item_id)
    if not existing: raise HTTPException(404)
    icon_path = existing["icon"]
    if file:
        if icon_path:
            try:
                os.remove(icon_path.replace("/media", "media"))
            except:
                pass
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/about") / filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
        icon_path = f"/media/about/{filename}"
    item = About(id=item_id, row=row, col=col, title=title, text=text, icon=icon_path)
    use_case.update(item_id, item)
    updated = use_case.get_by_id(item_id)
    return AboutSerializer(**updated)

@about_router.delete("/{item_id}")
def delete_about(item_id: int, use_case: AboutUseCase = Depends(get_about_usecase), admin=Depends(get_current_admin)):
    item = use_case.get_by_id(item_id)
    if not item: raise HTTPException(404)
    if item.get("icon"):
        try:
            os.remove(item["icon"].replace("/media", "media"))
        except:
            pass
    use_case.delete(item_id)
    return {"message": "Удалено"}


# Эндпоинты для Программы
@program_router.post("/", response_model=ProgramSerializer)
def create_program(item_data: ProgramCreateSerializer, use_case: ProgramUseCase = Depends(get_program_usecase), admin=Depends(get_current_admin)):
    item = Program(id=0, start_date=item_data.start_date, end_date=item_data.end_date, text=item_data.text, order_index=item_data.order_index)
    item_id = use_case.create(item)
    created = use_case.get_by_id(item_id)
    return ProgramSerializer(**created)

@program_router.get("/", response_model=List[ProgramSerializer])
def get_program(use_case: ProgramUseCase = Depends(get_program_usecase)):
    return [ProgramSerializer(**row) for row in use_case.get_all()]

@program_router.get("/{item_id}", response_model=ProgramSerializer)
def get_program_item(item_id: int, use_case: ProgramUseCase = Depends(get_program_usecase)):
    item = use_case.get_by_id(item_id)
    if not item: raise HTTPException(status_code=404, detail="Не найдено")
    return ProgramSerializer(**item)

@program_router.get("/event-date/")
def get_event_date(use_case: ProgramUseCase = Depends(get_program_usecase)):
    date = use_case.get_event_date()
    return {"date": date.isoformat() if date else None}

@program_router.put("/{item_id}", response_model=ProgramSerializer)
def update_program(item_id: int, item_data: ProgramCreateSerializer, use_case: ProgramUseCase = Depends(get_program_usecase), admin=Depends(get_current_admin)):
    item = Program(id=item_id, start_date=item_data.start_date, end_date=item_data.end_date, text=item_data.text, order_index=item_data.order_index)
    use_case.update(item_id, item)
    updated = use_case.get_by_id(item_id)
    return ProgramSerializer(**updated)

@program_router.delete("/{item_id}")
def delete_program(item_id: int, use_case: ProgramUseCase = Depends(get_program_usecase), admin=Depends(get_current_admin)):
    use_case.delete(item_id)
    return {"message": "Удалено"}


# Эндпоинты для Новостей
@news_router.post("/", response_model=NewsSerializer)
async def create_news(name: Optional[str] = Form(None), brief_description: Optional[str] = Form(None), full_description: Optional[str] = Form(None), file: UploadFile = File(None), use_case: NewsUseCase = Depends(get_news_usecase), admin = Depends(get_current_admin)) -> NewsSerializer:
    image_path = None
    if file:
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/news") / filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_path = f"/media/news/{filename}"
    news = News(name=name, image=image_path, brief_description=brief_description, full_description=full_description, is_available=True)
    news_id = use_case.create(news)
    created = use_case.get_by_id(news_id)
    return NewsSerializer(**created)

@news_router.get("/", response_model=List[NewsSerializer])
def get_news(search: str = None, year: int = None, sort_by: str = "created_at", sort_dir: str = "desc", usecase: NewsUseCase = Depends(get_news_usecase)) -> List[NewsSerializer]:
    return usecase.get_filtered(search, year, sort_by, sort_dir)

@news_router.get("/archived/", response_model=List[NewsSerializer])
def get_archived_news(search: str = None, year: int = None, sort_by: str = "created_at", sort_dir: str = "desc", usecase: NewsUseCase = Depends(get_news_usecase), admin=Depends(get_current_admin)) -> List[NewsSerializer]:
    return usecase.get_filtered_archived(search, year, sort_by, sort_dir)

@news_router.get("/{news_id}", response_model=NewsSerializer)
def get_news(news_id: int, use_case: NewsUseCase = Depends(get_news_usecase)) -> NewsSerializer:
    row = use_case.get_by_id(news_id)
    if not row: raise HTTPException(status_code=404, detail="Новость не найдена")
    return NewsSerializer(**row)

@news_router.put("/{news_id}", response_model=NewsSerializer)
async def update_news(news_id: int, name: Optional[str] = Form(None), brief_description: Optional[str] = Form(None), full_description: Optional[str] = Form(None), file: UploadFile = File(None), use_case: NewsUseCase = Depends(get_news_usecase), admin = Depends(get_current_admin)) -> NewsSerializer:
    existing = use_case.get_by_id(news_id)
    if not existing: raise HTTPException(status_code=404, detail="Новость не найдена")
    image_path = existing["image"]
    if file:
        if image_path:
            physical_path = image_path.replace("/media", "media", 1)
            try:
                os.remove(physical_path)
            except (OSError, FileNotFoundError):
                pass
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/news") / filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_path = f"/media/news/{filename}"
    news = News(id=news_id, name=name, image=image_path, brief_description=brief_description, full_description=full_description)
    use_case.update(news_id, news)
    updated = use_case.get_by_id(news_id)
    return NewsSerializer(**updated)

@news_router.delete("/{news_id}")
def disable_news(news_id: int, use_case: NewsUseCase = Depends(get_news_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(news_id)
    return {"message": "Новость отключена"}

@news_router.post("/{news_id}/restore")
def restore_news(news_id: int, usecase: NewsUseCase = Depends(get_news_usecase), admin=Depends(get_current_admin)):
    usecase.restore_news(news_id)
    return {"message": "Новость восстановлена"}


# Эндпоинты для Кейсов
@cases_router.post("/", response_model=CaseSerializer)
def create_case(case_data: CaseCreateSerializer, use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)) -> CaseSerializer:
    case = Case( id=0, name=case_data.name, case_number=case_data.case_number, level=case_data.level, description=case_data.description, partner_id=case_data.partner_id, is_available=True, teams_count=case_data.teams_count)
    case_id = use_case.create(case)
    created = use_case.get_by_id(case_id)
    return CaseSerializer(**created)

@cases_router.get("/", response_model=List[CaseSerializer])
def get_cases(search: str = None, year: int = None, level: str = None, sort_by: str = "case_number", sort_dir: str = "asc", use_case: CasesUseCase = Depends(get_cases_usecase)):
    return [CaseSerializer(**row) for row in use_case.get_filtered(search, year, level, sort_by, sort_dir)]

@cases_router.get("/archived/", response_model=List[CaseSerializer])
def get_archived_cases(search: str = None, year: int = None, level: str = None, sort_by: str = "case_number", sort_dir: str = "asc", use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)):
    return [CaseSerializer(**row) for row in use_case.get_filtered_archived(search, year, level, sort_by, sort_dir)]

@cases_router.get("/{case_id}", response_model=CaseSerializer)
def get_case(case_id: int, use_case: CasesUseCase = Depends(get_cases_usecase)):
    row = use_case.get_by_id(case_id)
    if not row: raise HTTPException(status_code=404, detail="Кейс не найден")
    return CaseSerializer(**row)

@cases_router.put("/{case_id}", response_model=CaseSerializer)
def update_case(case_id: int, case_data: CaseCreateSerializer, use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)) -> CaseSerializer:
    case = Case(id=case_id, name=case_data.name, case_number=case_data.case_number, level=case_data.level, description=case_data.description, partner_id=case_data.partner_id, teams_count=case_data.teams_count)
    use_case.update(case_id, case)
    updated = use_case.get_by_id(case_id)
    return CaseSerializer(**updated)

@cases_router.delete("/{case_id}")
def disable_case(case_id: int, use_case: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)):
    use_case.disable(case_id)
    return {"message": "Кейс отключён"}

@cases_router.post("/{case_id}/restore")
def restore_case(case_id: int, usecase: CasesUseCase = Depends(get_cases_usecase), admin=Depends(get_current_admin)):
    usecase.restore_case(case_id)
    return {"message": "Кейс восстановлен"}


# Эндпоинты для Партнёров
@partners_router.post("/", response_model=PartnerSerializer)
async def create_partner(name: Optional[str] = Form(None), description: Optional[str] = Form(None), full_description: Optional[str] = Form(None), site_link: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), use_case: PartnersUseCase = Depends(get_partners_usecase), admin = Depends(get_current_admin)) -> PartnerSerializer:
    image_path = None
    if file:
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/partners") / filename
        os.makedirs("media/partners", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_path = f"/media/partners/{filename}"
    partner = Partner(id=0, name=name, image=image_path, description=description, full_description=full_description, site_link=site_link, is_available=True)
    partner_id = use_case.create(partner)
    created = use_case.get_by_id(partner_id)
    return PartnerSerializer(**created)

@partners_router.get("/", response_model=List[PartnerSerializer])
def get_partners(search: str = None, sort_by: str = "created_at", sort_dir: str = "desc", use_case: PartnersUseCase = Depends(get_partners_usecase)) -> List[PartnerSerializer]:
    return [PartnerSerializer(**row) for row in use_case.get_filtered(search, sort_by, sort_dir)]

@partners_router.get("/archived/", response_model=List[PartnerSerializer])
def get_archived_partners(search: str = None, sort_by: str = "created_at", sort_dir: str = "desc", use_case: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)) -> List[PartnerSerializer]:
    return [PartnerSerializer(**row) for row in use_case.get_filtered_archived(search, sort_by, sort_dir)]

@partners_router.get("/{partner_id}", response_model=PartnerSerializer)
def get_partner(partner_id: int, use_case: PartnersUseCase = Depends(get_partners_usecase)) -> PartnerSerializer:
    row = use_case.get_by_id(partner_id)
    if not row: raise HTTPException(status_code=404, detail="Партнёр не найден")
    return PartnerSerializer(**row)

@partners_router.put("/{partner_id}", response_model=PartnerSerializer)
async def update_partner(partner_id: int, name: Optional[str] = Form(None), description: Optional[str] = Form(None), full_description: Optional[str] = Form(None), site_link: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), use_case: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)) -> PartnerSerializer:
    existing = use_case.get_by_id(partner_id)
    if not existing: raise HTTPException(status_code=404, detail="Партнёр не найден")
    image_path = existing.get("image")
    if file:
        if image_path:
            physical_path = image_path.replace("/media", "media", 1)
            try:
                os.remove(physical_path)
            except OSError:
                pass
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/partners") / filename
        os.makedirs("media/partners", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_path = f"/media/partners/{filename}"
    partner = Partner(id=partner_id, name=name, image=image_path, description=description, full_description=full_description, site_link=site_link)
    use_case.update(partner_id, partner)
    updated = use_case.get_by_id(partner_id)
    return PartnerSerializer(**updated)

@partners_router.delete("/{partner_id}")
def disable_partner(partner_id: int, use_case: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(partner_id)
    return {"message": "Партнёр отключён"}

@partners_router.post("/{partner_id}/restore")
def restore_partner(partner_id: int, usecase: PartnersUseCase = Depends(get_partners_usecase), admin=Depends(get_current_admin)):
    usecase.restore_partner(partner_id)
    return {"message": "Партнёр восстановлен"}


# Эндпоинты для Отзывов
@reviews_router.post("/", response_model=ReviewSerializer)
async def create_review(name: Optional[str] = Form(None), content: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin = Depends(get_current_admin)) -> ReviewSerializer:
    image_path = None
    if file:
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/reviews") / filename
        os.makedirs("media/reviews", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_path = f"/media/reviews/{filename}"
    review = Review(id=0, name=name, content=content, image=image_path, is_available=True)
    review_id = use_case.create(review)
    created = use_case.get_by_id(review_id)
    return ReviewSerializer(**created)

@reviews_router.get("/", response_model=List[ReviewSerializer])
def get_reviews(year: int = None, use_case: ReviewsUseCase = Depends(get_reviews_usecase)):
    return [ReviewSerializer(**row) for row in use_case.get_filtered(year)]

@reviews_router.get("/archived/", response_model=List[ReviewSerializer])
def get_archived_reviews(year: int = None, use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin=Depends(get_current_admin)):
    return [ReviewSerializer(**row) for row in use_case.get_filtered_archived(year)]

@reviews_router.get("/{review_id}", response_model=ReviewSerializer)
def get_review(review_id: int, use_case: ReviewsUseCase = Depends(get_reviews_usecase)) -> ReviewSerializer:
    row = use_case.get_by_id(review_id)
    if not row: raise HTTPException(status_code=404, detail="Отзыв не найден")
    return ReviewSerializer(**row)

@reviews_router.put("/{review_id}", response_model=ReviewSerializer)
async def update_review(review_id: int, name: Optional[str] = Form(None), content: Optional[str] = Form(None), file: Optional[UploadFile] = File(None), use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin = Depends(get_current_admin)) -> ReviewSerializer:
    existing = use_case.get_by_id(review_id)
    if not existing: raise HTTPException(status_code=404, detail="Отзыв не найден")
    image_path = existing.get("image")
    if file:
        if image_path:
            physical_path = image_path.replace("/media", "media", 1)
            try:
                os.remove(physical_path)
            except OSError:
                pass
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = Path("media/reviews") / filename
        os.makedirs("media/reviews", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_path = f"/media/reviews/{filename}"
    review = Review(id=review_id, name=name, content=content, image=image_path)
    use_case.update(review_id, review)
    updated = use_case.get_by_id(review_id)
    return ReviewSerializer(**updated)

@reviews_router.delete("/{review_id}")
def disable_review(review_id: int, use_case: ReviewsUseCase = Depends(get_reviews_usecase), admin=Depends(get_current_admin)) -> dict:
    use_case.disable(review_id)
    return {"message": "Отзыв отключён"}

@reviews_router.post("/{review_id}/restore")
def restore_review(review_id: int, usecase: ReviewsUseCase = Depends(get_reviews_usecase), admin=Depends(get_current_admin)):
    usecase.restore_review(review_id)
    return {"message": "Отзыв восстановлен"}


# Эндпоинты для ФотоАльбомов
@photoalbums_router.post("/", response_model=PhotoAlbumSerializer)
def create_photoalbum(photoalbum_data: PhotoAlbumCreateSerializer, use_case: PhotoAlbumsUseCase = Depends(get_photoalbums_usecase), admin=Depends(get_current_admin)):
    photoalbum = PhotoAlbum(id=0, name=photoalbum_data.name, is_available=True)
    photoalbum_id = use_case.create(photoalbum)
    photoalbum.id = photoalbum_id
    return PhotoAlbumSerializer.from_entity(photoalbum)

@photoalbums_router.get("/", response_model=List[PhotoAlbumSerializer])
def get_photoalbums(use_case: PhotoAlbumsUseCase=Depends(get_photoalbums_usecase)):
    data = use_case.get_all()
    return [PhotoAlbumSerializer.from_entity(i.album, i.photos) for i in data]

@photoalbums_router.get("/{photoalbum_id}")
def get_photoalbum(photoalbum_id: int, use_case: PhotoAlbumsUseCase=Depends(get_photoalbums_usecase)):
    item = use_case.get_by_id(photoalbum_id)
    if not item: raise HTTPException(404)
    return PhotoAlbumSerializer.from_entity(item.album, item.photos)

@photoalbums_router.put("/{photoalbum_id}")
def update_photoalbum(photoalbum_id: int, photoalbum_data: PhotoAlbumCreateSerializer, use_case: PhotoAlbumsUseCase=Depends(get_photoalbums_usecase), admin=Depends(get_current_admin)):
    photoalbum = PhotoAlbum(id=photoalbum_id, name=photoalbum_data.name, is_available=True)
    use_case.update(photoalbum_id, photoalbum)
    updated = use_case.get_by_id(photoalbum_id)
    return PhotoAlbumSerializer.from_entity(updated.album, updated.photos)

@photoalbums_router.delete("/{photoalbum_id}")
def delete_photoalbum(photoalbum_id: int, use_case: PhotoAlbumsUseCase=Depends(get_photoalbums_usecase), admin=Depends(get_current_admin)):
    use_case.delete(photoalbum_id)
    return {"message": "deleted"}


# Эндпоинты для Фото
@photos_router.post("/upload/{album_id}", response_model=PhotoSerializer)
async def upload_photo(album_id: int, file: UploadFile = File(...), use_case: PhotosUseCase=Depends(get_photos_usecase), admin=Depends(get_current_admin)):
    album_dir = Path(UPLOAD_DIR) / f"album_{album_id}"
    album_dir.mkdir(parents=True, exist_ok=True)
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    path = album_dir / filename
    with open(path, "wb") as f:
        f.write(await file.read())
    db_path = f"/media/albums/album_{album_id}/{filename}"
    photo = Photo(0, album_id, db_path, datetime.utcnow(), True)
    photo.id = use_case.create(photo)
    return PhotoSerializer.from_entity(photo)

@photos_router.get("/{id}", response_model=PhotoSerializer)
def get(id: int, use_case: PhotosUseCase = Depends(get_photos_usecase)):
    photo = use_case.get_by_id(id)
    if not photo: raise HTTPException(404)
    return PhotoSerializer.from_entity(photo)

@photos_router.delete("/{id}")
def delete(id: int, use_case: PhotosUseCase = Depends(get_photos_usecase)):
    use_case.delete(id)
    return {"message": "deleted"}


# Эндпоинты для Регистрации
@registration_router.post("/")
def create_registration(data: RegistrationRequestSerializer, usecase: RegistrationUseCase = Depends(get_registration_usecase)):
    reg = Registration(**data.team.dict())
    participants = [p.dict() for p in data.participants]
    reg_id = usecase.create(reg, participants)
    return {"id": reg_id}

@registration_router.get("/", response_model=List[RegistrationSerializer])
def get_all(search: str = None, level: str = None, case_id: int = None, sort_by: str = "created_at", sort_dir: str = "desc", usecase: RegistrationUseCase = Depends(get_registration_usecase)):
    return usecase.get_filtered(search, level, case_id, sort_by, sort_dir)

@registration_router.get("/archived/", response_model=List[RegistrationSerializer])
def get_all_archived(search: str = None, level: str = None, case_id: int = None, sort_by: str = "created_at", sort_dir: str = "desc", usecase: RegistrationUseCase = Depends(get_registration_usecase), admin=Depends(get_current_admin)):
    return usecase.get_filtered_archived(search, level, case_id, sort_by, sort_dir)

@registration_router.get("/{reg_id}", response_model=RegistrationSerializer)
def get_one(reg_id: int, usecase: RegistrationUseCase = Depends(get_registration_usecase)):
    reg = usecase.get_by_id(reg_id)
    if not reg: raise HTTPException(status_code=404, detail="Регистрация не найдена")
    return reg

@registration_router.put("/{reg_id}")
def update_registration(reg_id: int, data: RegistrationRequestSerializer, usecase: RegistrationUseCase = Depends(get_registration_usecase), admin=Depends(get_current_admin)):
    reg = Registration(**data.team.dict())
    participants = [p.dict() for p in data.participants]
    usecase.update(reg_id, reg, participants)
    return {"message": "Регистрация обновлена"}

@registration_router.delete("/{reg_id}")
def disable_registration(reg_id: int, usecase: RegistrationUseCase = Depends(get_registration_usecase), admin=Depends(get_current_admin)):
    usecase.disable_registration(reg_id)
    return {"message": "Команда отключена"}

@registration_router.post("/{reg_id}/restore")
def restore_registration(reg_id: int, usecase: RegistrationUseCase = Depends(get_registration_usecase), admin=Depends(get_current_admin)):
    usecase.restore_registration(reg_id)
    return {"message": "Команда восстановлена"}

@registration_router.post("/{reg_id}/participant")
def create_participant(reg_id: int, p: ParticipantsCreateSerializer, usecase: RegistrationUseCase = Depends(get_registration_usecase), admin=Depends(get_current_admin)):
    usecase.create_participant(reg_id, p.dict())
    return {"message": "Участник добавлен"}

@registration_router.delete("/participant/{p_id}")
def delete_participant(p_id: int, usecase: RegistrationUseCase = Depends(get_registration_usecase), admin=Depends(get_current_admin)):
    usecase.delete_participant(p_id)
    return {"message": "Участник удалён"}
