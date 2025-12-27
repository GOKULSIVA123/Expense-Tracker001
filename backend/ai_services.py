import os

# Check if the AI library is available
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

def generate_financial_report(expenses, prefs):
    if not HAS_GENAI:
        return {"error": "AI library not installed on server"}, 503

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "GEMINI_API_KEY not set"}, 500

    # Construct the prompt
    prompt_text = "I need a financial update based on my recent expenses.\n"
    prompt_text += f"Expenses Data: {str(expenses)}\n"
    
    if prefs:
        goal = prefs.get("goal_amount", "N/A")
        date = prefs.get("target_date", "N/A")
        prompt_text += f"My Goal: Save {goal} by {date}.\n"
    
    prompt_text += "Please analyze my spending habits and tell me if I'm on track. Keep it concise."

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt_text)
        return {"report": response.text}, 200
    except Exception as e:
        print(f"AI Service Error: {e}")
        return {"error": f"Failed: {str(e)}"}, 500
