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
        "plain", "utf-8"
    )
    msg["Subject"] = "Восстановление пароля"
    msg["From"] = SMTP_LOGIN
    msg["To"] = to_email
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30) as server:  # timeout=30 сек
            print(f"[EMAIL] Connected to {SMTP_SERVER}:{SMTP_PORT}", flush=True)
            server.set_debuglevel(1)  # Детальные логи
            server.starttls()
            print("[EMAIL] TLS handshake OK", flush=True)
            server.login(SMTP_LOGIN, SMTP_PASSWORD)
            print("[EMAIL] Login OK", flush=True)
            server.send_message(msg)
            print("[EMAIL] Sent successfully", flush=True)
    except Exception as e:
        print(f"[EMAIL] ERROR: {type(e).__name__}: {str(e)}", flush=True)
        raise  # Чтобы HTTP вернул 500 с деталями