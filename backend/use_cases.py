from entities import Admin, Acquaintance, Program, About, Case, News, Partner, PhotoAlbum, Photo, PhotoAlbumWithPhotos, Review, Registration, Participant
from repositories import AdminRepository, AcquaintanceRepository, ProgramRepository, AboutRepository, CasesRepository, NewsRepository, PartnersRepository, PhotoAlbumsRepository, PhotosRepository, ReviewsRepository, RegistrationRepository
from typing import List, Optional, Dict, Any
from security import verify_password, hash_password
import secrets
from datetime import datetime, timedelta
import re


class AdminUseCase:
    def __init__(self, repository: AdminRepository):
        self.repository = repository

    def login(self, login: str, password: str):
        user = self.repository.get_by_login(login)
        if not user: return None
        user_id, user_login, password_hash, user_email = user
        if not verify_password(password, password_hash): return None
        return {"id": user_id, "login": user_login, "email": user_email}

    def request_password_reset(self, email: str) -> str:
        admin = self.repository.get_by_email(email)
        if not admin: return None
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)
        self.repository.save_password_reset_token(admin_id=admin[0], token=token, expires_at=expires_at)
        return token

    def reset_password(self, token: str, new_password: str):
        token_data = self.repository.get_reset_token(token)
        if not token_data:
            raise ValueError("Неверный токен")
        token_id, admin_id, _, expires_at, used = token_data
        if used:
            raise ValueError("Токен уже использован")
        if expires_at < datetime.utcnow():
            raise ValueError("Токен истёк")
        password_hash = hash_password(new_password)
        self.repository.update_password(admin_id, password_hash)
        self.repository.mark_token_used(token_id)

class AcquaintanceUseCase:
    def __init__(self, repository: AcquaintanceRepository):
        self.repository = repository

    def create(self, item: Acquaintance) -> int:
        return self.repository.create(item)

    def get_all(self) -> List[Acquaintance]:
        return self.repository.get_all()

    def get_by_id(self, item_id: int) -> Optional[Acquaintance]:
        return self.repository.get_by_id(item_id)
    
    def get_by_title(self, title: str) -> Optional[Acquaintance]:
        return self.repository.get_by_title(title)

    def update(self, item_id: int, item: Acquaintance) -> None:
        self.repository.update(item_id, item)


class AboutUseCase:
    def __init__(self, repository: AboutRepository):
        self.repository = repository

    def create(self, item: About) -> int:
        return self.repository.create(item)

    def get_all(self) -> List[About]:
        return self.repository.get_all()

    def get_by_id(self, item_id: int) -> Optional[About]:
        return self.repository.get_by_id(item_id)

    def update(self, item_id: int, item: About) -> None:
        self.repository.update(item_id, item)

    def delete(self, item_id: int) -> None:
        self.repository.delete(item_id)


class ProgramUseCase:
    def __init__(self, repository: ProgramRepository):
        self.repository = repository

    def create(self, item: Program) -> int:
        return self.repository.create(item)

    def get_all(self) -> List[Program]:
        return self.repository.get_all()

    def get_by_id(self, item_id: int) -> Optional[Program]:
        return self.repository.get_by_id(item_id)
    
    def get_event_date(self):
        return self.repository.get_event_date()

    def update(self, item_id: int, item: Program) -> None:
        self.repository.update(item_id, item)

    def delete(self, item_id: int) -> None:
        self.repository.delete(item_id)


class NewsUseCase:
    def __init__(self, repository: NewsRepository):
        self.repository = repository

    def create(self, news: News) -> int:
        return self.repository.create(news)

    def get_all_true(self) -> List[News]:
        return self.repository.get_all_true()
    
    def get_all_false(self) -> List[News]:
        return self.repository.get_all_false()

    def get_by_id(self, news_id: int) -> Optional[News]:
        return self.repository.get_by_id(news_id)

    def get_by_year(self, year: int) -> List[News]:
        return self.repository.get_by_year(year)

    def update(self, news_id: int, news: News) -> None:
        self.repository.update(news_id, news)

    def disable(self, news_id: int) -> None:
        self.repository.disable(news_id)


class CasesUseCase:
    def __init__(self, repository: CasesRepository):
        self.repository = repository

    def create(self, case: Case) -> int:
        return self.repository.create(case)

    def get_all(self) -> List[Dict[str, Any]]:
        return self.repository.get_all_with_partner()

    def get_by_id(self, case_id: int) -> Optional[Dict[str, Any]]:
        return self.repository.get_by_id_with_partner(case_id)
    
    def get_unavailable(self):
        return self.repository.get_unavailable()

    def get_by_year(self, year: int):
        return self.repository.get_by_year(year)

    def update(self, case_id: int, case: Case) -> None:
        self.repository.update(case_id, case)

    def disable(self, case_id: int) -> None:
        self.repository.disable(case_id)


class PartnersUseCase:
    def __init__(self, repository: PartnersRepository):
        self.repository = repository

    def create(self, partner: Partner) -> int:
        return self.repository.create(partner)

    def get_all_true(self) -> List[Partner]:
        return self.repository.get_all_true()
    
    def get_all_false(self) -> List[Partner]:
        return self.repository.get_all_false()

    def get_by_id(self, partner_id: int) -> Optional[Partner]:
        return self.repository.get_by_id(partner_id)

    def update(self, partner_id: int, partner: Partner) -> None:
        self.repository.update(partner_id, partner)

    def disable(self, partner_id: int) -> None:
        self.repository.disable(partner_id)


class ReviewsUseCase:
    def __init__(self, repository: ReviewsRepository):
        self.repository = repository
        
    def create(self, review: Review) -> int:
        return self.repository.create(review)
    
    def get_all_true(self) -> List[Review]:
        return self.repository.get_all_true()
    
    def get_all_false(self) -> List[Review]:
        return self.repository.get_all_false()

    def get_by_id(self, review_id: int) -> Optional[Review]:
        return self.repository.get_by_id(review_id)

    def update(self, review_id: int, review: Review) -> None:
        self.repository.update(review_id, review)

    def disable(self, review_id: int) -> None:
        self.repository.disable(review_id)


class PhotoAlbumsUseCase:
    def __init__(self, repository: PhotoAlbumsRepository):
        self.repository = repository

    def create(self, photoalbum: PhotoAlbum) -> int:
        return self.repository.create(photoalbum)

    def get_all(self) -> List[Dict[str, Any]]:
        return self.repository.get_all_with_photos()

    def get_by_id(self, photoalbum_id: int) -> Optional[Dict[str, Any]]:
        return self.repository.get_by_id_with_photos(photoalbum_id)

    def update(self, photoalbum_id: int, photoalbum: PhotoAlbum) -> None:
        self.repository.update(photoalbum_id, photoalbum)

    def disable(self, photoalbum_id: int) -> None:
        self.repository.disable(photoalbum_id)
        

class PhotosUseCase:
    def __init__(self, repository: PhotosRepository):
        self.repository = repository

    def create(self, photo: Photo) -> int:
        return self.repository.create(photo)

    def get_all(self) -> List[Photo]:
        return self.repository.get_all()

    def get_by_id(self, photo_id: int) -> Optional[Photo]:
        return self.repository.get_by_id(photo_id)

    def update(self, photo_id: int, photo: Photo) -> None:
        self.repository.update(photo_id, photo)

    def disable(self, photo_id: int) -> None:
        self.repository.disable(photo_id)


class RegistrationUseCase:
    def __init__(self, repository: RegistrationRepository, cases_repository: CasesRepository):
        self.repository = repository
        self.cases_repository = cases_repository

    def _validate_email(self, email: str) -> bool:
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        return re.match(pattern, email) is not None

    def _validate_phone(self, phone: str) -> bool:
        # базовая проверка (подходит для большинства форматов)
        pattern = r"^\+?\d{10,15}$"
        return re.match(pattern, phone) is not None

    def _validate_curator(self, curator_data):
        if not isinstance(curator_data, dict):
            return False
        if "fio" not in curator_data or "phone" not in curator_data:
            return False
        if not curator_data["fio"] or not curator_data["phone"]:
            return False
        if not self._validate_phone(curator_data["phone"]):
            return False
        return True

    def create(self, data, participants) -> int:    
        # количество участников
        if int(data.amount_participants) != len(participants):
            raise Exception("Количество участников не совпадает")
        if len(participants) < 2 or len(participants) > 5:
            raise Exception("Команда должна быть от 2 до 5 человек")
        seen = set()
        for p in participants:
            key = (p["fio"].strip().lower(), int(p["course"]))
            if key in seen:
                raise Exception(f"Дублирующийся участник: {p['fio']}")
            seen.add(key)
        # уникальность названия команды
        if self.repository.exists_team_name(data.name):
            raise Exception("Команда с таким названием уже существует")
        # уникальность участников (ФИО + курс)
        for p in participants:
            fio = p["fio"].strip().lower()
            if self.repository.exists_participant(fio, int(p["course"])):
                raise Exception(f"Участник {p['fio']} с таким курсом уже зарегистрирован")
        # проверка капитана
        if not any(p["role"] == "капитан" for p in participants):
            raise Exception("В команде должен быть капитан")
        if sum(1 for p in participants if p["role"] == "капитан") > 1:
            raise Exception("Капитан должен быть только один")
        if not self._validate_email(data.captain_email):
            raise Exception("Некорректный email капитана")
        if not self._validate_phone(data.captain_phone):
            raise Exception("Некорректный телефон капитана")
        # проверка курса (1–5)
        try:
            courses = [int(p["course"]) for p in participants]
        except:
            raise Exception("Некорректный курс участника")
        if any(c < 1 or c > 5 for c in courses):
            raise Exception("Курс должен быть от 1 до 5")
        # agreement
        if not data.agreement:
            raise Exception("Необходимо Согласие на обработку данных")
        # acquaintance
        if not data.acquaintance:
            raise Exception("Необходима Политика конфиденциальности")
        # curator_data
        if not self._validate_curator(data.curator_data):
            raise Exception("Некорректные данные куратора")
        # кейсы
        if data.selected_case == data.spare_case:
            raise Exception("Основной и запасной кейс не могут совпадать")
        case = self.cases_repository.get_by_id(data.selected_case)
        if not case:
            raise Exception("Кейс не найден")
        current_count = self.repository.count_by_case(data.selected_case, "selected_case")
        limit = case.teams_count
        if limit is not None and current_count >= limit:
            raise Exception("Этот кейс уже заполнен")
        spare_case = self.cases_repository.get_by_id(data.spare_case)
        if not spare_case:
            raise Exception("Запасной кейс не найден")
        current_count_spare = self.repository.count_by_case(data.spare_case, "spare_case")
        limit_spare = spare_case.teams_count
        if limit_spare is not None and current_count_spare >= limit_spare:
            raise Exception("Запасной кейс уже заполнен")
        # проверка уровня
        case = self.cases_repository.get_by_id(data.selected_case)
        if not case: raise Exception("Кейс не найден")
        case_level = (case.level or "").lower()
        level = (data.level_education or "").lower()
        if case_level == "стартовый":
            if any(c > 2 for c in courses) or level == "магистратура":
                raise Exception("Этот кейс только для 1-2 курса")
        if case_level == "продвинутый":
            if any(c < 3 for c in courses) and level != "магистратура":
                raise Exception("Этот кейс только для 3+ курса и магистрантов")
        return self.repository.create_registration(data, participants)

    def get_all(self) -> List[Dict[str, Any]]:
        return self.repository.get_all()

    def get_by_id(self, reg_id) -> Optional[Dict[str, Any]]:
        return self.repository.get_by_id(reg_id)

    def disable_registration(self, reg_id) -> None:
        self.repository.disable_registration(reg_id)

    def delete_participant(self, p_id) -> None:
        self.repository.delete_participant(p_id)

    def update(self, reg_id: int, data, participants) -> None:
        # количество участников
        if int(data.amount_participants) != len(participants):
            raise Exception("Количество участников не совпадает")
        if len(participants) < 2 or len(participants) > 5:
            raise Exception("Команда должна быть от 2 до 5 человек")
        seen = set()
        for p in participants:
            key = (p["fio"].strip().lower(), int(p["course"]))
            if key in seen:
                raise Exception(f"Дублирующийся участник: {p['fio']}")
            seen.add(key)
        # уникальность названия команды (исключая себя)
        if self.repository.exists_team_name(data.name, exclude_id=reg_id):
            raise Exception("Команда с таким названием уже существует")
        # уникальность участников (исключая свою команду)
        for p in participants:
            fio = p["fio"].strip().lower()
            if self.repository.exists_participant(fio, int(p["course"]), exclude_registration_id=reg_id):
                raise Exception(f"Участник {p['fio']} с таким курсом уже зарегистрирован")
        # проверка капитана
        if not any(p["role"] == "капитан" for p in participants):
            raise Exception("В команде должен быть капитан")
        if sum(1 for p in participants if p["role"] == "капитан") > 1:
            raise Exception("Капитан должен быть только один")
        if not self._validate_email(data.captain_email):
            raise Exception("Некорректный email капитана")
        if not self._validate_phone(data.captain_phone):
            raise Exception("Некорректный телефон капитана")
        # проверка курса (1–5)
        try:
            courses = [int(p["course"]) for p in participants]
        except:
            raise Exception("Некорректный курс участника")
        if any(c < 1 or c > 5 for c in courses):
            raise Exception("Курс должен быть от 1 до 5")
        # agreement
        if not data.agreement:
            raise Exception("Необходимо Согласие на обработку данных")
        # acquaintance
        if not data.acquaintance:
            raise Exception("Необходима Политика конфиденциальности")
        # curator_data
        if not self._validate_curator(data.curator_data):
            raise Exception("Некорректные данные куратора")
        # кейсы
        if data.selected_case == data.spare_case:
            raise Exception("Основной и запасной кейс не могут совпадать")
        case = self.cases_repository.get_by_id(data.selected_case)
        if not case:
            raise Exception("Кейс не найден")
        current_count = self.repository.count_by_case_exclude_self(data.selected_case, "selected_case", reg_id)
        limit = case.teams_count
        if limit is not None and current_count >= limit:
            raise Exception("Этот кейс уже заполнен")
        spare_case = self.cases_repository.get_by_id(data.spare_case)
        if not spare_case:
            raise Exception("Запасной кейс не найден")
        current_count_spare = self.repository.count_by_case_exclude_self(data.spare_case, "spare_case", reg_id)
        limit_spare = spare_case.teams_count
        if limit_spare is not None and current_count_spare >= limit_spare:
            raise Exception("Запасной кейс уже заполнен")
        # проверка уровня
        case = self.cases_repository.get_by_id(data.selected_case)
        if not case: raise Exception("Кейс не найден")
        case_level = (case.level or "").lower()
        level = (data.level_education or "").lower()
        if case_level == "стартовый":
            if any(c > 2 for c in courses) or level == "магистратура":
                raise Exception("Этот кейс только для 1-2 курса")
        if case_level == "продвинутый":
            if any(c < 3 for c in courses) and level != "магистратура":
                raise Exception("Этот кейс только для 3+ курса и магистрантов")
        self.repository.update_registration(reg_id, data, participants)