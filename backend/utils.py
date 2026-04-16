import requests

CLIENT_ID = "sp_id_ea20d23ab97db44504db0bc1ffa8577d"
CLIENT_SECRET = "sp_apikey_e5107e56964ff5b290cf36a64bdb78a655953a5443d42feb9314b56b2407a025"

def get_token():
    url = "https://api.sendpulse.com/oauth/access_token"
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    response = requests.post(url, data=data)
    return response.json()["access_token"]


def send_reset_email(to_email: str, reset_link: str):
    token = get_token()

    url = "https://api.sendpulse.com/smtp/emails"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    data = {
        "email": {
            "html": f"<p>Ссылка для сброса пароля:</p><a href='{reset_link}'>{reset_link}</a>",
            "text": f"Ссылка для сброса пароля: {reset_link}",
            "subject": "Восстановление пароля",
            "from": {
                "name": "Hakaton",
                "email": "agoodwill04@hakaton1.bizml.ru"
            },
            "to": [
                {
                    "email": to_email
                }
            ]
        }
    }

    response = requests.post(url, json=data, headers=headers)

    print(response.status_code, response.text)