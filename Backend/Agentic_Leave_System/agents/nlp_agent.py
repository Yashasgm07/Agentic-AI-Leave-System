import requests
import os

# Load API key from environment (safe way)
API_KEY = os.getenv("OPENROUTER_API_KEY")

API_URL = "https://openrouter.ai/api/v1/chat/completions"


HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost",
    "X-Title": "Agentic Leave System"
}


# -----------------------
# Call LLM (Single Try)
# -----------------------
CACHE = {}


def ask_llm(prompt):

    if prompt in CACHE:
        return CACHE[prompt]


    if not API_KEY:
        print("LLM Disabled: API Key Missing")
        return None


    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }


    try:
        res = requests.post(
            API_URL,
            headers=HEADERS,
            json=payload,
            timeout=8
        )


        if res.status_code != 200:
            print("LLM HTTP Error:", res.text)
            return None


        data = res.json()


        if "choices" in data:

            response = data["choices"][0]["message"]["content"].strip()

            CACHE[prompt] = response

            return response


        print("LLM Bad Response:", data)
        return None


    except Exception as e:
        print("LLM Exception:", e)
        return None



# -----------------------
# NLP Agent
# -----------------------
def extract_leave_type(reason):

    prompt = f"""
Classify leave type.

Reason: {reason}

Choose only one:
Sick Leave
Medical Emergency
Vacation Leave
Casual Leave
Personal Leave
"""


    response = ask_llm(prompt)


    # Fallback
    if not response:

        text = reason.lower()

        if "sick" in text:
            return "Sick Leave"

        if "vacation" in text:
            return "Vacation Leave"

        return "Casual Leave"


    return response
