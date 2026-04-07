from flask import Flask, request, jsonify
from flask_cors import CORS

from agents.nlp_agent import extract_leave_type
from agents.policy_agent import policy_reasoning
from agents.decision_agent import final_decision
from agents.email_agent import send_notification

from memory.memory_store import load_history, save_history
from memory.notification_store import save_notification, load_notifications
from memory.user_store import load_users, save_users

from datetime import date, datetime
import bcrypt


from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)


# ============================
# APP SETUP
# ============================

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "agentic-secret-key"

jwt = JWTManager(app)


# ============================
# LOAD POLICY
# ============================

with open("config/policy.txt") as f:
    POLICY = f.read()


# ============================
# REGISTER
# ============================

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    username = data.get("username")
    password = data.get("password")
    role = data.get("role")   # employee / hr


    if not username or not password or not role:
        return jsonify({"error": "Missing fields"}), 400


    users = load_users()


    for u in users:
        if u["username"] == username:
            return jsonify({"error": "User already exists"}), 400


    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()


    users.append({
        "username": username,
        "password": hashed,
        "role": role
    })


    save_users(users)


    return jsonify({"message": "Registered successfully"}), 200



# ============================
# LOGIN
# ============================

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    username = data.get("username")
    password = data.get("password")


    users = load_users()


    for u in users:

        if u["username"] == username:

            if bcrypt.checkpw(
                password.encode(),
                u["password"].encode()
            ):

                token = create_access_token(
                    identity=username
                )


                return jsonify({
                    "token": token,
                    "role": u["role"],
                    "username": username
                }), 200


    return jsonify({"error": "Invalid login"}), 401



# ============================
# APPLY LEAVE (WITH DATES)
# ============================

@app.route("/apply-leave", methods=["POST"])
@jwt_required()
def apply_leave():

    username = get_jwt_identity()


    data = request.json

    reason = data.get("reason")
    from_date = data.get("from_date")
    to_date = data.get("to_date")


    if not reason or not from_date or not to_date:
        return jsonify({"error": "Missing fields"}), 400


    # Convert dates
    try:
        start = datetime.strptime(from_date, "%Y-%m-%d")
        end = datetime.strptime(to_date, "%Y-%m-%d")

        days = (end - start).days + 1

        if days <= 0:
            return jsonify({"error": "Invalid date range"}), 400

    except:
        return jsonify({"error": "Invalid date format"}), 400


    history = load_history()


    # Calculate yearly used leaves
    used = sum(
        int(h["days"])
        for h in history
        if h["name"] == username
    )


    # NLP Agent
    leave_type = extract_leave_type(reason)


    # Policy Agent
    policy_decision = policy_reasoning(
        leave_type,
        days,
        POLICY,
        history[-5:],
        used
    )


    # Decision Agent
    result = final_decision(
        reason,
        leave_type,
        days,
        policy_decision
    )


    # Save record
    record = {
        "name": username,
        "reason": reason,
        "from_date": from_date,
        "to_date": to_date,
        "days": days,
        "status": result["status"],
        "message": result["message"],
        "date": str(date.today())
    }


    save_history(record)


    # HR Notification
    notification = {
        "title": "New Leave Request",
        "message": f"{username} applied from {from_date} to {to_date}",
        "status": record["status"],
        "date": record["date"],
        "read": False
    }

    save_notification(notification)


    # Send Email
    send_notification(
        username,
        reason,
        days,
        record["status"]
    )


    return jsonify(record), 200



# ============================
# HISTORY (ROLE BASED)
# ============================

@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():

    username = get_jwt_identity()


    users = load_users()

    role = "employee"

    for u in users:
        if u["username"] == username:
            role = u["role"]


    history = load_history()


    # HR sees all
    if role == "hr":
        return jsonify(history), 200


    # Employee sees own
    my = [
        h for h in history
        if h["name"] == username
    ]


    return jsonify(my), 200



# ============================
# NOTIFICATIONS (HR ONLY)
# ============================

@app.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():

    username = get_jwt_identity()


    users = load_users()

    role = "employee"

    for u in users:
        if u["username"] == username:
            role = u["role"]


    if role != "hr":
        return jsonify({"error": "Forbidden"}), 403


    data = load_notifications()

    return jsonify(data), 200



# ============================
# RUN SERVER
# ============================

if __name__ == "__main__":
    app.run(debug=True)
