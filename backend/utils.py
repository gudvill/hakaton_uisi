import requests
import time


def send_reset_email(to_email: str, reset_link: str):
    API_KEY = "sp_apikey_e5107e56964ff5b290cf36a64bdb78a655953a5443d42feb9314b56b2407a025"

    url = "https://api.sendpulse.com/smtp/emails"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "email": {
            "html": f"<p>Ссылка для сброса пароля:</p><a href='{reset_link}'>{reset_link}</a>",
            "text": f"Ссылка для сброса пароля: {reset_link}",
            "subject": "Восстановление пароля",
            "from": {
                "name": "Hakaton",
                "email": "agoodwill04@gmail.com"
            },
            "to": [
                {"email": to_email}
            ]
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    print(response.status_code, response.text)

    data = response.json()

    if not data.get("result"):
        raise Exception(f"SendPulse error: {data}")