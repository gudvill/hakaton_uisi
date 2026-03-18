from typing import List, Optional
from entities import Case
from repositories import CasesRepository

class CasesUseCase:
    def __init__(self, repository: CasesRepository):
        self.repository = repository

    def create(self, case: Case) -> int:
        return self.repository.create(case)

    def get_all(self) -> List[Case]:
        return self.repository.get_all()

    def get_by_id(self, case_id: int) -> Optional[Case]:
        return self.repository.get_by_id(case_id)

    def update(self, case_id: int, case: Case) -> None:
        self.repository.update(case_id, case)

    def disable(self, case_id: int) -> None:
        self.repository.disable(case_id)