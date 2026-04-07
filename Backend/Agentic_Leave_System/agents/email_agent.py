import smtplib
import os
from email.message import EmailMessage


EMAIL = os.getenv("EMAIL_USER")
PASSWORD = os.getenv("EMAIL_PASS")
MANAGER_EMAIL = os.getenv("MANAGER_EMAIL")


def send_notification(name, reason, days, decision):

    print("EMAIL USER:", EMAIL)
    print("EMAIL PASS:", "SET" if PASSWORD else "NOT SET")
    print("MANAGER:", MANAGER_EMAIL)


    if not EMAIL or not PASSWORD or not MANAGER_EMAIL:
        print("❌ Email disabled: Credentials missing")
        return


    subject = "Leave Request Notification"

    body = f"""
New Leave Request

Employee: {name}
Reason: {reason}
Days: {days}

Decision: {decision}

-- Agentic AI Leave System
"""


    msg = EmailMessage()

    msg["From"] = EMAIL
    msg["To"] = MANAGER_EMAIL
    msg["Subject"] = subject
    msg.set_content(body)


    try:
        print("Connecting to Gmail...")

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        print("Logging in...")

        server.login(EMAIL, PASSWORD)

        print("Sending mail...")

        server.send_message(msg)

        server.quit()

        print("✅ Email sent successfully!")


    except Exception as e:
        print("❌ Email Error:", e)
