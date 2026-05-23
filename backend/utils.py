import os
import time
import resend
import requests

resend.api_key = os.getenv("RESEND_API_KEY")

YANDEX_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN")
COUNTER_ID = os.getenv("YANDEX_METRIKA_COUNTER_ID")
BASE_URL = "https://api-metrika.yandex.net/stat/v1/data"

_cache: dict = {}
CACHE_TTL = 300  # 5 минут

def _get_cached(key: str, fetch_fn):
    entry = _cache.get(key)
    if entry and time.time() - entry["ts"] < CACHE_TTL:
        return entry["data"]
    data = fetch_fn()
    _cache[key] = {"data": data, "ts": time.time()}
    return data

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


def _fetch_metrika(key, params):
    def fetch():
        headers = {"Authorization": f"OAuth {YANDEX_TOKEN}"}
        r = requests.get(BASE_URL, headers=headers, params={"ids": COUNTER_ID, **params})
        r.raise_for_status()
        return r.json()
    return _get_cached(key, fetch)


def get_all_analytics():
    return {
        "visits": _fetch_metrika("visits_and_views", {
            "metrics": "ym:s:visits,ym:s:pageviews,ym:s:avgVisitDurationSeconds,ym:s:pageDepth",
            "dimensions": "ym:s:date",
            "date1": "30daysAgo", "date2": "today", "sort": "ym:s:date",
        }),
        "sessions": _fetch_metrika("visit_sessions", {
            "dimensions": "ym:s:dateTime,ym:s:startURL,ym:s:endURL",
            "metrics": "ym:s:avgVisitDurationSeconds,ym:s:pageDepth",
            "date1": "7daysAgo", "date2": "today", "sort": "-ym:s:dateTime", "limit": 200,
        }),
        "pages": _fetch_metrika("top_pages", {
            "dimensions": "ym:pv:URLPath",
            "metrics": "ym:pv:pageviews",
            "date1": "30daysAgo", "date2": "today", "sort": "-ym:pv:pageviews", "limit": 10,
        }),
        "devices": _fetch_metrika("devices", {
            "dimensions": "ym:s:deviceCategory",
            "metrics": "ym:s:visits",
            "date1": "30daysAgo", "date2": "today", "sort": "-ym:s:visits",
        }),
        "sources": _fetch_metrika("traffic_sources", {
            "dimensions": "ym:s:trafficSourceName",
            "metrics": "ym:s:visits",
            "date1": "30daysAgo", "date2": "today", "sort": "-ym:s:visits",
        }),
    }