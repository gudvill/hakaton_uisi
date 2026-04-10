import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.yandex.ru"
SMTP_PORT = 587
SMTP_LOGIN = "alex.goodwill04@yandex.ru"
SMTP_PASSWORD = "uhtetyxjrvuihgpo"

msg = MIMEText("Тестовое письмо", "plain", "utf-8")
msg["Subject"] = "Test"
msg["From"] = SMTP_LOGIN
msg["To"] = "agoodwill04@gmail.com"

server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
server.set_debuglevel(1)
server.starttls()
server.login(SMTP_LOGIN, SMTP_PASSWORD)
server.send_message(msg)
server.quit()