import smtplib
from email.mime.text import MIMEText
import os


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_LOGIN = "agoodwill04@gmail.com"
SMTP_PASSWORD = "igyi jtak qqyl ftoi"

def send_reset_email(to_email: str, reset_link: str):
    print(f"[EMAIL] Attempting to send password reset email to: {to_email}")
    try:
        # Настройка письма
        subject = "Восстановление пароля"
        body = f"""
        Здравствуйте!

        Вы запросили сброс пароля.
        Перейдите по ссылке, чтобы изменить пароль:

        {reset_link}

        Если вы этого не делали — просто проигнорируйте это письмо.
        """
        msg = MIMEText(body, "plain", "utf-8")
        msg['Subject'] = subject
        msg['From'] = SMTP_LOGIN
        msg['To'] = to_email

        # Подключение к SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.set_debuglevel(1)  # ⚡ подробный debug SMTP
            server.starttls()
            server.login(SMTP_LOGIN, SMTP_PASSWORD)
            server.send_message(msg)

        print("[EMAIL] Email sent successfully!")

    except smtplib.SMTPException as e:
        print(f"[EMAIL ERROR] SMTPException: {e}")
    except Exception as e:
        print(f"[EMAIL ERROR] Other Exception: {e}")