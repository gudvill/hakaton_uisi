import smtplib
from email.mime.text import MIMEText
import os


SMTP_SERVER = "77.88.21.158"
SMTP_PORT = 465
SMTP_LOGIN = "alex.goodwill04@yandex.ru"
SMTP_PASSWORD = "uhtetyxjrvuihgpo"

def send_reset_email(to_email: str, reset_link: str):
    print("[EMAIL] Sending reset email...", flush=True)
    
    msg = MIMEText(f"Ссылка для сброса пароля:\n\n{reset_link}", "plain", "utf-8")
    msg["Subject"] = "Восстановление пароля"
    msg["From"] = "alex.goodwill04@yandex.ru"  # Твой Gmail
    msg["To"] = to_email
    
    try:
        with smtplib.SMTP_SSL("77.88.21.158", 465, timeout=30) as server:
            print("[EMAIL] SSL Connected to Yandex:465", flush=True)
            server.login("alex.goodwill04@yandex.ru", "uhtetyxjrvuihgpo")  # Твои creds
            print("[EMAIL] Login OK", flush=True)
            server.send_message(msg)
            print("[EMAIL] Sent successfully!", flush=True)
    except Exception as e:
        print(f"[EMAIL] ERROR: {type(e).__name__}: {str(e)}", flush=True)
        raise