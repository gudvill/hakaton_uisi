import requests
import time

CLIENT_ID = "cb2131530fc86aa3a81b1a9b3c27e766"
CLIENT_SECRET = "76f40dc7f26caf1b83044463dab03db3"

_token_cache = {
    "access_token": None,
    "expires_at": 0
}


def get_token():
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"]:
        return _token_cache["access_token"]

    url = "https://api.sendpulse.com/oauth/token"

    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=data, headers=headers)
    print("CLIENT_ID:", CLIENT_ID)
    print("CLIENT_SECRET:", CLIENT_SECRET)
    print(response.status_code, response.text)

    data = response.json()

    if "access_token" not in data:
        raise Exception(f"Auth failed: {data}")

    _token_cache["access_token"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + 3500

    return data["access_token"]


def send_reset_email(to_email: str, reset_link: str):
    token = get_token()

    url = "https://api.sendpulse.com/smtp/emails"

    headers = {
        "Authorization": f"Bearer {token}",
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

    print("[SENDPULSE] email status:", response.status_code)
    print("[SENDPULSE] email response:", response.text)

    data = response.json()

    if not data.get("result"):
        raise Exception(f"SendPulse error: {data}")

    print("[SENDPULSE] email sent successfully")