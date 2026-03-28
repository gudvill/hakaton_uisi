from entities import Admin, Program, About, Case, News, Partner, PhotoAlbum, Photo, PhotoAlbumWithPhotos, Review, Registration, Participant
from repositories import AdminRepository, ProgramRepository, AboutRepository, CasesRepository, NewsRepository, PartnersRepository, PhotoAlbumsRepository, PhotosRepository, ReviewsRepository
from typing import List, Optional, Dict, Any
from security import verify_password


class AdminUseCase:
    def __init__(self, repository: AdminRepository):
        self.repository = repository

    def login(self, login: str, password: str):
        user = self.repository.get_by_login(login)
        if not user: return None
        user_id, user_login, password_hash = user
        if not verify_password(password, password_hash): return None
        return {"id": user_id, "login": user_login}
    

class ProgramUseCase:
    def __init__(self, repository: ProgramRepository):
        self.repository = repository

    def create(self, item: Program) -> int:
        return self.repository.create(item)

    def get_all(self) -> List[Program]:
        return self.repository.get_all_ordered()

    def get_by_id(self, item_id: int) -> Optional[Program]:
        return self.repository.get_by_id(item_id)

    def update(self, item_id: int, item: Program) -> None:
        self.repository.update(item_id, item)

    def delete(self, item_id: int) -> None:
        self.repository.delete(item_id)


class AboutUseCase:
    def __init__(self, repository: AboutRepository):
        self.repository = repository

    def create(self, item: About) -> int:
        return self.repository.create(item)

    def get_all(self) -> List[About]:
        return self.repository.get_all_ordered()

    def get_by_id(self, item_id: int) -> Optional[About]:
        return self.repository.get_by_id(item_id)

    def update(self, item_id: int, item: About) -> None:
        self.repository.update(item_id, item)

    def delete(self, item_id: int) -> None:
        self.repository.delete(item_id)


class CasesUseCase:
    def __init__(self, repository: CasesRepository):
        self.repository = repository

    def create(self, case: Case) -> int:
        return self.repository.create(case)

    def get_all(self) -> List[Dict[str, Any]]:
        return self.repository.get_all_with_partner()

    def get_by_id(self, case_id: int) -> Optional[Dict[str, Any]]:
        return self.repository.get_by_id_with_partner(case_id)

    def update(self, case_id: int, case: Case) -> None:
        self.repository.update(case_id, case)

    def disable(self, case_id: int) -> None:
        self.repository.disable(case_id)


class NewsUseCase:
    def __init__(self, repository: NewsRepository):
        self.repository = repository

    def create(self, news: News) -> int:
        return self.repository.create(news)

    def get_all(self) -> List[News]:
        return self.repository.get_all()

    def get_by_id(self, news_id: int) -> Optional[News]:
        return self.repository.get_by_id(news_id)

    def update(self, news_id: int, news: News) -> None:
        self.repository.update(news_id, news)

    def disable(self, news_id: int) -> None:
        self.repository.disable(news_id)


class PartnersUseCase:
    def __init__(self, repository: PartnersRepository):
        self.repository = repository

    def create(self, partner: Partner) -> int:
        return self.repository.create(partner)

    def get_all(self) -> List[Partner]:
        return self.repository.get_all()

    def get_by_id(self, partner_id: int) -> Optional[Partner]:
        return self.repository.get_by_id(partner_id)

    def update(self, partner_id: int, partner: Partner) -> None:
        self.repository.update(partner_id, partner)

    def disable(self, partner_id: int) -> None:
        self.repository.disable(partner_id)


class PhotoAlbumsUseCase:
    def __init__(self, repository: PhotoAlbumsRepository):
        self.repository = repository

    def create(self, photoalbum: PhotoAlbum) -> int:
        return self.repository.create(photoalbum)

    def get_all(self) -> List[PhotoAlbumWithPhotos]:
        return self.repository.get_all_with_photos()

    def get_by_id(self, photoalbum_id: int) -> Optional[PhotoAlbumWithPhotos]:
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


class ReviewsUseCase:
    def __init__(self, repository: ReviewsRepository):
        self.repository = repository
        
    def create(self, review: Review) -> int:
        return self.repository.create(review)

    def get_all(self) -> List[Review]:
        return self.repository.get_all()

    def get_by_id(self, review_id: int) -> Optional[Review]:
        return self.repository.get_by_id(review_id)

    def update(self, review_id: int, review: Review) -> None:
        self.repository.update(review_id, review)

    def disable(self, review_id: int) -> None:
        self.repository.disable(review_id)