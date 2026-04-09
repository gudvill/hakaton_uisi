import smtplib
from email.mime.text import MIMEText
import os


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_LOGIN = "agoodwill04@gmail.com"
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_reset_email(to_email: str, reset_link: str):
    subject = "Восстановление пароля"
    body = f"Перейдите по ссылке, чтобы сбросить пароль: {reset_link}"
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SMTP_LOGIN
    msg['To'] = to_email

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_LOGIN, SMTP_PASSWORD)
        server.send_message(msg)