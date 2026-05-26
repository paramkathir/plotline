import os
import json
import anthropic
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv("../.env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("VITE_ANTHROPIC_KEY"))

class SceneRequest(BaseModel):
    genre: str
    protagonist: str
    world: str
    tone: str
    history: list[dict]
    choice: str | None = None

def build_prompt(req: SceneRequest) -> str:
    history_text = ""
    for scene in req.history:
        history_text += f"\n\n{scene['content']}"
        if scene.get('chosen'):
            history_text += f"\n\n[Player chose: {scene['chosen']}]"

    choice_text = f"\n\nThe player chose: {req.choice}" if req.choice else ""

    return f"""You are writing an interactive novel.

Setting: {req.world}
Genre: {req.genre}
Protagonist: {req.protagonist}
Tone: {req.tone}

Story so far:{history_text}{choice_text}

Write the next scene of this story. Requirements:
- Write 3-5 immersive paragraphs in {req.tone} tone
- End at a moment of decision or tension
- Then provide exactly 3 choices for the player on what to do next
- Format your response as JSON with this exact structure:
{{
  "content": "the full scene text here",
  "choices": ["choice 1", "choice 2", "choice 3"]
}}
- Make choices meaningfully different from each other
- Do not include any text outside the JSON"""

@app.post("/scene")
async def generate_scene(req: SceneRequest):
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1500,
        messages=[{"role": "user", "content": build_prompt(req)}]
    )

    raw = message.content[0].text.strip()
    json_match = raw[raw.find('{'):raw.rfind('}')+1]
    parsed = json.loads(json_match)

    return parsed

@app.get("/health")
def health():
    return {"status": "ok"}