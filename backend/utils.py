import os
import resend
import requests

resend.api_key = os.getenv("RESEND_API_KEY")

YANDEX_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN")
COUNTER_ID = os.getenv("YANDEX_METRIKA_COUNTER_ID")
BASE_URL = "https://api-metrika.yandex.net/stat/v1/data"

def send_reset_email(to_email: str, reset_link: str):
    response = resend.Emails.send({
        "from": "Hakaton <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Восстановление пароля",
        "html": f"""
            <p>Ссылка для сброса пароля:</p>
            <a href="{reset_link}">{reset_link}</a>
        """
    })
    print("[RESEND] response:", response)
    return response


def get_visits_and_views():
    headers = { "Authorization": f"OAuth {YANDEX_TOKEN}" }
    params = {
        "ids": COUNTER_ID,
        "metrics": "ym:s:visits,ym:s:pageviews",
        "dimensions": "ym:s:date",
        "date1": "30daysAgo",
        "date2": "today",
        "sort": "ym:s:date"
    }
    response = requests.get(BASE_URL, headers=headers, params=params)
    response.raise_for_status()
    return response.json()