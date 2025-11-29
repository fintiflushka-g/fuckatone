import os
import json
import re
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

# Загрузка переменных окружения
load_dotenv()
FOLDER_ID = os.getenv("FOLDER_ID")
API_KEY = os.getenv("API_KEY")

# Инициализация клиента
client = OpenAI(
    base_url="https://rest-assistant.api.cloud.yandex.net/v1",
    api_key=API_KEY,
    project=FOLDER_ID,
)

# Загрузка prompt и структуры организации при запуске
with open("systemprompt.txt", "r", encoding="utf-8") as f:
    SYSTEM_PROMPT = f.read()

with open("org.json", "r", encoding="utf-8") as f:
    ORG_JSON = f.read()

FULL_PROMPT = SYSTEM_PROMPT.replace("<ORGANIZATION_JSON>", ORG_JSON)

# FastAPI
app = FastAPI()

class PlainTextInput(BaseModel):
    text: str

def extract_json(text: str):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            return {"error": "Invalid JSON returned from model"}
    return {"error": "No JSON found in model response"}

@app.post("/process")
async def process_message(request: Request):
    try:
        body = await request.body()
        message = body.decode("utf-8").strip()
        if not message:
            return JSONResponse(content={"error": "Empty input"}, status_code=400)

        # Запрос в YandexGPT
        resp = client.responses.create(
            model=f"gpt://{FOLDER_ID}/qwen3-235b-a22b-fp8/latest",
            instructions=FULL_PROMPT,
            input=message,
        )

        parsed = extract_json(resp.output_text)
        return JSONResponse(content=parsed, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
