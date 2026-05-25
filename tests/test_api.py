import pytest
from httpx import Client

BASE_URL = "http://hakaton1.bizml.ru/api"

# логин
def test_login_success():
    with Client(base_url=BASE_URL) as client:
        res = client.post("/admin/login", json={
            "login": "admin",
            "password": "admin123"
        })
    assert res.status_code == 200
    assert "access_token" in client.cookies

def test_protected_without_token():
    with Client(base_url=BASE_URL) as client:
        res = client.get("/admin/me")
    assert res.status_code == 401

def test_invalid_login():
    with Client(base_url=BASE_URL) as client:
        res = client.post("/admin/login", json={
            "login": "test",
            "password": "test"
        })
    assert res.status_code == 401

def test_logout():
    with Client(base_url=BASE_URL) as client:
        client.post("/admin/login", json={
            "login": "admin",
            "password": "admin123"
        })
        res = client.post("/admin/logout")
    assert res.status_code == 200

# кейсы
def test_case_crud_flow():
    with Client(base_url=BASE_URL) as client:
        # логин
        login = client.post("/admin/login", json={
            "login": "admin",
            "password": "admin123"
        })
        assert login.status_code == 200

        # создание кейса
        create_payload = {
            "name": "Тестовый кейс",
            "case_number": 1,
            "level": "стартовый",
            "description": "Описание тестового кейса",
            "partner_id": 1,
            "teams_count": 10
        }
        create_res = client.post( "/cases/", json=create_payload)
        assert create_res.status_code in [200, 201]
        created_case = create_res.json()
        case_id = created_case["id"]

        # получение кейса
        get_res = client.get(f"/cases/{case_id}")
        assert get_res.status_code == 200

        # обновление кейса
        update_payload = {
            "name": "Обновлённый тестовый кейс",
            "case_number": 1,
            "level": "стартовый",
            "description": "Новое описание тестового кейса",
            "partner_id": 1,
            "teams_count": 10
        }

        update_res = client.put(f"/cases/{case_id}", json=update_payload)
        assert update_res.status_code == 200

        # отключение кейса
        disable_res = client.delete(f"/cases/{case_id}")
        assert disable_res.status_code == 200

        # восстановление кейса
        restore_res = client.post(f"/cases/{case_id}/restore")
        assert restore_res.status_code == 200


# регистарция
def test_create_registration_success():
    payload = {
        "team": {
            "name": "Тест",
            "institution": "Тест",
            "amount_participants": 2,
            "participation_form": "Очная",
            "level_education": "бакалавриат/специалитет",
            "selected_case": 1,
            "spare_case": 2,
            "captain_phone": "+7 (999) 111-22-33",
            "captain_email": "test@mail.com",
            "curator_data": {
                "fio": "Тест",
                "phone": "+7 (999) 111-22-33"
            },
            "agreement": True,
            "acquaintance": True
        },
        "participants": [
            {"fio": "Тест", "course": 2, "role": "капитан"},
            {"fio": "Тест1", "course": 2, "role": "участник"}
        ]
    }
    with Client(base_url=BASE_URL) as client:
        res = client.post("/registration/", json=payload)
    assert res.status_code == 200
    assert "id" in res.json()

def test_registration_validation_errors():
    payload = {
        "team": {
            "name": "Тест2",
            "institution": "Тест",
            "amount_participants": 2,
            "participation_form": "Очная",
            "level_education": "бакалавриат/специалитет",
            "selected_case": 1,
            "spare_case": 2,
            "captain_phone": "+7 (999) 111-22-33",
            "captain_email": "test@mail.com",
            "curator_data": {
                "fio": "Тест2",
                "phone": "+7 (999) 111-22-33"
            },
            "agreement": True,
            "acquaintance": True
        },
        "participants": [
            {"fio": "Тест2", "course": 2, "role": "участник"},
            {"fio": "Тест3", "course": 2, "role": "участник"}
        ]
    }
    with Client(base_url=BASE_URL) as client:
        res = client.post("/registration/", json=payload)
    assert res.status_code in [400, 422, 500]

def test_invalid_email():
    payload = {
        "team": {
            "name": "Тест3",
            "institution": "Тест",
            "amount_participants": 2,
            "participation_form": "Очная",
            "level_education": "бакалавриат/специалитет",
            "selected_case": 1,
            "spare_case": 2,
            "captain_phone": "+7 (999) 111-22-33",
            "captain_email": "test",
            "curator_data": {
                "fio": "Тест3",
                "phone": "+7 (999) 111-22-33"
            },
            "agreement": True,
            "acquaintance": True
        },
        "participants": [
            {"fio": "Тест4", "course": 2, "role": "капитан"},
            {"fio": "Тест5", "course": 2, "role": "участник"}
        ]
    }
    with Client(base_url=BASE_URL) as client:
        res = client.post("/registration/", json=payload)
    assert res.status_code in [400, 422, 500]

def test_less_than_2_participants():
    payload = {
        "team": {
            "name": "Тест4",
            "institution": "Тест",
            "amount_participants": 1,
            "participation_form": "Очная",
            "level_education": "бакалавриат/специалитет",
            "selected_case": 1,
            "spare_case": 2,
            "captain_phone": "+7 (999) 111-22-33",
            "captain_email": "test@mail.com",
            "curator_data": {
                "fio": "Тест4",
                "phone": "+7 (999) 111-22-33"
            },
            "agreement": True,
            "acquaintance": True
        },
        "participants": [
            {"fio": "Тест6", "course": 2, "role": "капитан"}
        ]
    }
    with Client(base_url=BASE_URL) as client:
        res = client.post("/registration/", json=payload)
    assert res.status_code in [400, 422, 500]