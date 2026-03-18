from fastapi import APIRouter, HTTPException, Depends
from typing import List
from entities import Cases
from serializers import CasesSerializer, CasesCreateSerializer
from use_cases import CasesUseCase
from dependencies import get_cases_usecase

cases_router = APIRouter(prefix="/cases", tags=["cases"])

@cases_router.post("/", response_model=CasesSerializer)
def create_case(case_data: CasesCreateSerializer, use_case: CasesUseCase = Depends(get_cases_usecase)) -> CasesSerializer:
    case = Cases(
        id=0,
        name=case_data.name,
        case_number=case_data.case_number,
        image=case_data.image,
        level=case_data.level,
        description=case_data.description,
        partner_id=case_data.partner_id,
        role=case_data.role,
        status=True)
    case_id = use_case.create(case)
    case.id = case_id
    return CasesSerializer.from_entity(case)


@cases_router.get("/", response_model=List[CasesSerializer])
def get_cases(use_case: CasesUseCase = Depends(get_cases_usecase)) -> List[CasesSerializer]:
    cases = use_case.get_all()
    return [CasesSerializer.from_entity(c) for c in cases]


@cases_router.get("/{case_id}", response_model=CasesSerializer)
def get_case(case_id: int, use_case: CasesUseCase = Depends(get_cases_usecase)) -> CasesSerializer:
    case = use_case.get_by_id(case_id)
    if not case: raise HTTPException(status_code=404, detail="Кейс не найден")
    return CasesSerializer.from_entity(case)


@cases_router.put("/{case_id}", response_model=CasesSerializer)
def update_case(case_id: int, case_data: CasesCreateSerializer, use_case: CasesUseCase = Depends(get_cases_usecase)) -> CasesSerializer:
    case = Cases(
        id=case_id,
        name=case_data.name,
        case_number=case_data.case_number,
        image=case_data.image,
        level=case_data.level,
        description=case_data.description,
        partner_id=case_data.partner_id,
        role=case_data.role)
    use_case.update(case_id, case)
    updated_case = use_case.get_by_id(case_id)
    return CasesSerializer.from_entity(updated_case)


@cases_router.delete("/{case_id}")
def disable_case(case_id: int, use_case: CasesUseCase = Depends(get_cases_usecase)) -> dict:
    use_case.disable(case_id)
    return {"message": "Кейс отключён"}