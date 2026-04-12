import smtplib
from email.mime.text import MIMEText
import os


SMTP_SERVER = "mailhog"
SMTP_PORT = 1025

def send_reset_email(to_email: str, reset_link: str):
    print("[EMAIL] Sending to MailHog...", flush=True)
    
    msg = MIMEText(f"Ссылка для сброса пароля:\n\n{reset_link}", "plain", "utf-8")
    msg["Subject"] = "Восстановление пароля"
    msg["From"] = "admin@hakaton.local"
    msg["To"] = to_email
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            print(f"[EMAIL] Connected to MailHog:{SMTP_PORT}", flush=True)
            server.send_message(msg)  # Без login/starttls!
            print("[EMAIL] Sent to MailHog OK!", flush=True)
    except Exception as e:
        print(f"[EMAIL] ERROR: {type(e).__name__}: {str(e)}", flush=True)
        raise