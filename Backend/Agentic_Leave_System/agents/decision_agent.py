from agents.nlp_agent import ask_llm


def final_decision(reason, leave_type, days, policy_decision):


    def fallback():

        if policy_decision == "Reject":
            return {
                "status": "Rejected",
                "message": "Leave rejected as per policy"
            }

        if policy_decision == "Review":
            return {
                "status": "Pending",
                "message": "Manager approval required"
            }

        return {
            "status": "Approved",
            "message": "Leave auto-approved"
        }


    prompt = f"""
You are HR AI agent.

Leave Type: {leave_type}
Reason: {reason}
Days: {days}
Policy: {policy_decision}

Return:

Decision:
Explanation:
"""


    response = ask_llm(prompt)


    if not response:
        return fallback()


    text = response.lower()


    if "reject" in text:
        return {
            "status": "Rejected",
            "message": "Rejected by AI evaluation"
        }

    if "review" in text:
        return {
            "status": "Pending",
            "message": "Requires manager approval"
        }

    return {
        "status": "Approved",
        "message": "Approved by AI analysis"
    }
