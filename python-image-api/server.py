from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
import base64
from google import genai
from google.genai import types
import uvicorn
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate-image")
async def generate_image(req: PromptRequest):
    contents = req.prompt

    response = client.models.generate_content(
        model="gemini-2.0-flash-preview-image-generation",
        contents=contents,
        config=types.GenerateContentConfig(
          response_modalities=['TEXT', 'IMAGE']
        )
    )

    # Find first image part
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            img_bytes = part.inline_data.data
            b64_str = base64.b64encode(img_bytes).decode("utf-8")
            return {"imageBase64": b64_str, "prompt": contents}

    return {"error": "No image generated"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
