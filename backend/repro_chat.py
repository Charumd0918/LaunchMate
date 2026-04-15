import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
WORKING_MODEL = "gemini-2.0-flash"

def test_chat():
    idea = "AI Coffee Machine"
    history = []
    msg = "hi"
    
    try:
        system_prompt = f"ACT AS A STRATEGIC STARTUP CO-FOUNDER. THE VENTURE UNDER AUDIT IS: '{idea}'.\n"
        full_contents = []
        
        for entry in history:
            role = "user" if entry.get("role") == "user" else "model"
            if full_contents and full_contents[-1]["role"] == role:
                full_contents[-1]["parts"][0]["text"] += f"\n{entry.get('text', '')}"
            else:
                full_contents.append({"role": role, "parts": [{"text": entry.get("text", "")}]})
        
        if full_contents and full_contents[-1]["role"] == "user":
            full_contents[-1]["parts"][0]["text"] += f"\n{msg}"
        else:
            full_contents.append({"role": "user", "parts": [{"text": msg}]})

        print(f"Contents: {json.dumps(full_contents, indent=2)}")
        
        response = client.models.generate_content(
            model=WORKING_MODEL, 
            contents=full_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt
            )
        )
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
