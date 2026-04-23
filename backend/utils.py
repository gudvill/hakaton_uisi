import resend

resend.api_key = "re_Q5xonnYt_3y4dacoYGzQmdT6SBN86HNjG"

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