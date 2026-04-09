import smtplib
from email.mime.text import MIMEText
import os

SMTP_SERVER = "smtp.yandex.ru"
SMTP_PORT = 587
SMTP_LOGIN = "alex.goodwill04@yandex.ru"
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_reset_email(to_email: str, reset_link: str) -> bool:
    print(f"[EMAIL 1] START: {to_email}")
    
    if not SMTP_PASSWORD:
        print("[EMAIL ERROR] SMTP_PASSWORD is EMPTY!")
        return False
    
    print(f"[EMAIL 2] Password OK ({len(SMTP_PASSWORD)} chars)")
    
    subject = "Восстановление пароля"
    body = f"""
        Здравствуйте!

        Вы запросили сброс пароля.
        Перейдите по ссылке: {reset_link}

        Если вы этого не делали — просто проигнорируйте это письмо."""
    
    msg = MIMEText(body, "plain", "utf-8")
    msg['Subject'] = subject
    msg['From'] = SMTP_LOGIN
    msg['To'] = to_email
    
    print(f"[EMAIL 3] Message prepared")
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30)
        print(f"[EMAIL 4] Connected to {SMTP_SERVER}:{SMTP_PORT}")
        
        server.set_debuglevel(1)
        server.starttls()
        print(f"[EMAIL 5] TLS OK")
        
        server.login(SMTP_LOGIN, SMTP_PASSWORD)
        print(f"[EMAIL 6] LOGIN SUCCESS!")
        
        server.send_message(msg)
        print(f"[EMAIL 7] SENT SUCCESS!")
        
        server.quit()
        print(f"[EMAIL 8] QUIT OK")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"[EMAIL AUTH ERROR] {e.smtp_error.decode()}")
        return False
    except smtplib.SMTPConnectError as e:
        print(f"[EMAIL CONNECT ERROR] {e}")
        return False
    except smtplib.SMTPServerDisconnected as e:
        print(f"[EMAIL DISCONNECT ERROR] {e}")
        return False
    except Exception as e:
        print(f"[EMAIL UNKNOWN ERROR] {type(e).__name__}: {e}")
        return False