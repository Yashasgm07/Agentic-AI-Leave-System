import json
import os
from datetime import datetime


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(BASE_DIR, "leave_history.json")


# -----------------------
# Load History
# -----------------------
def load_history():

    if not os.path.exists(FILE):
        return []

    try:
        with open(FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    except:
        return []


# -----------------------
# Save History (APPEND)
# -----------------------
def save_history(record):

    history = load_history()

    history.append(record)

    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=4)


# -----------------------
# Yearly Leave Calculator
# -----------------------
def yearly_leave_used(history, name):

    year = datetime.now().year
    total = 0

    for r in history:
        if r["name"] == name:

            r_year = int(r["date"].split("-")[0])

            if r_year == year:
                total += int(r["days"])

    return total
