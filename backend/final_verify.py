import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Using EXACT names from the ListModels output
MODEL_CANDIDATES = ["gemini-flash-latest", "gemini-pro-latest", "gemini-2.0-flash-lite", "gemini-1.5-flash"]

def test_chat():
    idea = "AI Coffee Machine"
    msg = "hi"
    
    for model_name in MODEL_CANDIDATES:
        try:
            print(f"Trying model: {model_name}...")
            response = client.models.generate_content(
                model=model_name, 
                contents=msg,
                config=types.GenerateContentConfig(
                    system_instruction="You are a startup co-founder."
                )
            )
            print(f"SUCCESS with {model_name}!")
            print(f"Response: {response.text}")
            return
        except Exception as e:
            print(f"FAIL with {model_name}: {e}")

if __name__ == "__main__":
    test_chat()
