from agents.nlp_agent import ask_llm


def policy_reasoning(leave_type, days, policy_text, history, yearly_used):

    leave_type = leave_type.lower()


    # ===============================
    # RULE ENGINE (MAIN AUTHORITY)
    # ===============================


    # 1️⃣ Yearly limit
    if yearly_used + days > 20:
        return {
            "status": "REJECTED",
            "reason": "Yearly leave limit exceeded"
        }


    # 2️⃣ Sick Leave
    if "sick" in leave_type:

        if days <= 3:
            return {
                "status": "APPROVED",
                "reason": "Sick leave auto approved"
            }

        else:
            return {
                "status": "PENDING",
                "reason": "Long sick leave requires review"
            }


    # 3️⃣ Medical Emergency
    if "medical" in leave_type or "emergency" in leave_type:

        return {
            "status": "APPROVED",
            "reason": "Medical emergency approved"
        }


    # 4️⃣ Casual / Family / Personal
    if any(word in leave_type for word in ["casual", "family", "personal", "marriage", "function"]):

        if days <= 3:
            return {
                "status": "APPROVED",
                "reason": "Short casual leave approved"
            }

        else:
            return {
                "status": "PENDING",
                "reason": "Long casual leave needs manager approval"
            }


    # 5️⃣ Vacation / Trip / Tour
    if any(word in leave_type for word in ["vacation", "trip", "tour", "holiday"]):

        if days <= 5:
            return {
                "status": "APPROVED",
                "reason": "Vacation within limit approved"
            }

        else:
            return {
                "status": "PENDING",
                "reason": "Long vacation requires approval"
            }


    # 6️⃣ Frequent Leave Detection
    recent = history[-5:]

    recent_count = sum(1 for h in recent if h["name"])

    if recent_count >= 4:
        return {
            "status": "PENDING",
            "reason": "Frequent leave pattern detected"
        }


    # ===============================
    # AI SUPPORT (SECONDARY)
    # ===============================

    prompt = f"""
Company Leave Policy:
{policy_text}

Employee yearly usage: {yearly_used}

Recent History:
{history}

Request:
Type: {leave_type}
Days: {days}

Decide strictly:
APPROVE / REVIEW / REJECT
"""


    response = ask_llm(prompt)


    if response:

        text = response.lower()

        if "reject" in text:
            return {
                "status": "REJECTED",
                "reason": "Rejected by AI policy analysis"
            }

        if "review" in text or "manager" in text:
            return {
                "status": "PENDING",
                "reason": "Needs manager review (AI)"
            }

        if "approve" in text:
            return {
                "status": "APPROVED",
                "reason": "Approved by AI analysis"
            }


    # ===============================
    # FINAL FALLBACK
    # ===============================

    return {
        "status": "APPROVED",
        "reason": "Auto approved (default policy)"
    }
