from agents.nlp_agent import extract_leave_type
from agents.policy_agent import policy_reasoning
from agents.decision_agent import final_decision
from agents.email_agent import send_notification
from memory.memory_store import load_history, save_history, yearly_leave_used
from datetime import date

with open("config/policy.txt") as f:
    POLICY = f.read()

TOTAL_LEAVES = 20

print("\n🤖 Agentic AI Leave Management System")

while True:
    print("\n1. Apply Leave")
    print("2. View Leave History")
    print("3. Exit")

    ch = input("Select: ")

    if ch == "1":
        name = input("Employee Name: ")
        reason = input("Leave Reason: ")
        days = int(input("Number of Days: "))

        history = load_history()
        used = yearly_leave_used(history, name)

        leave_type = extract_leave_type(reason)

        policy_decision = policy_reasoning(
            leave_type, days, POLICY, history[-5:], used
        )

        final_response = final_decision(
            reason, leave_type, days, policy_decision
        )

        record = {
            "name": name,
            "reason": reason,
            "days": days,
            "leave_type": leave_type,
            "policy_decision": policy_decision,
            "final_decision": final_response,
            "date": str(date.today())
        }

        history.append(record)
        save_history(history)

        print("\n🤖 FINAL AGENT DECISION:\n")
        print(final_response)

        if "Reject" not in final_response:
            remaining = TOTAL_LEAVES - (used + days)
        else:
            remaining = TOTAL_LEAVES - used

        print(f"\n✅ Remaining Leave Balance This Year: {remaining} days")

        send_notification(name, reason, days, final_response)
        print("\n📧 Manager Notified by Email")

    elif ch == "2":
        history = load_history()
        for i, r in enumerate(history, 1):
            print(f"\n{i}. {r['name']} | {r['date']}")
            print(r["final_decision"])

    elif ch == "3":
        print("System Closed.")
        break

    else:
        print("Invalid option.")
