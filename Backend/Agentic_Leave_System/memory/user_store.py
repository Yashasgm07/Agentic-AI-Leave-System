import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILE = os.path.join(BASE_DIR, "users.json")


def load_users():

    if not os.path.exists(FILE):
        return []

    with open(FILE, "r") as f:
        return json.load(f)


def save_users(data):

    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)
