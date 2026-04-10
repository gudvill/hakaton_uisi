import smtplib
from email.mime.text import MIMEText
import os


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_LOGIN = "agoodwill04@gmail.com"
SMTP_PASSWORD = "iqbqqkwcswijxvma"

def send_reset_email(to_email: str, reset_link: str):
    print("[EMAIL] Sending reset email...", flush=True)

    msg = MIMEText(
        f"Ссылка для сброса пароля:\n\n{reset_link}",
        "plain",
        "utf-8"
    )

    msg["Subject"] = "Восстановление пароля"
    msg["From"] = SMTP_LOGIN
    msg["To"] = to_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.set_debuglevel(1)
        server.starttls()
        server.login(SMTP_LOGIN, SMTP_PASSWORD)
        server.send_message(msg)

    print("[EMAIL] Sent successfully", flush=True)