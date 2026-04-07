import json
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(BASE_DIR, "notifications.json")


def load_notifications():

    if not os.path.exists(FILE):
        return []

    try:
        with open(FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    except:
        return []


def save_notification(notification):

    data = load_notifications()

    data.append(notification)

    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def clear_notifications():

    with open(FILE, "w", encoding="utf-8") as f:
        json.dump([], f)
