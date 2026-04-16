import requests
import time

CLIENT_ID = "sp_id_ea20d23ab97db44504db0bc1ffa8577d"
CLIENT_SECRET = "sp_sk_85281420cfa09f41de278515dd9687f1"

_token_cache = {
    "access_token": None,
    "expires_at": 0
}


def get_token():
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"]:
        print("[SENDPULSE] using cached token")
        return _token_cache["access_token"]

    print("[SENDPULSE] requesting new token...")

    url = "https://api.sendpulse.com/oauth/access_token"

    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    response = requests.post(url, data=data)

    print("[SENDPULSE] auth status:", response.status_code)
    print("[SENDPULSE] auth response:", response.text)

    try:
        data = response.json()
    except Exception:
        raise Exception(f"Invalid JSON from SendPulse auth: {response.text}")

    token = data.get("access_token")

    if not token:
        raise Exception(f"SendPulse auth failed: {data}")

    _token_cache["access_token"] = token
    _token_cache["expires_at"] = time.time() + 3500

    return token


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
                "email": "agoodwill04@hakaton1.bizml.ru"
            },
            "to": [
                {"email": to_email}
            ]
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    print("[SENDPULSE] email status:", response.status_code)
    print("[SENDPULSE] email response:", response.text)

    if response.status_code >= 400:
        raise Exception(f"SendPulse email failed: {response.text}")

    print("[SENDPULSE] email sent successfully")