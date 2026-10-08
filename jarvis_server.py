import os
from typing import Optional
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
app=FastAPI(title="MyAI / JARVIS X Backend", version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"])

API_KEY=os.getenv("AI_API_KEY","")
BASE_URL=os.getenv("AI_BASE_URL","https://api.openai.com/v1").rstrip("/")
MODEL=os.getenv("AI_MODEL","gpt-5.6-mini")
SYSTEM=("You are the AI engine for MyAI and JARVIS X. Be helpful, accurate, concise when appropriate, "
        "and transparent about uncertainty. Never claim to have performed an action you did not perform. "
        "Adapt explanations to the user's requested level.")

class Ask(BaseModel):
    message:str
    context:Optional[str]=None

def live_wikipedia(query):
    try:
        r=requests.get("https://en.wikipedia.org/w/api.php",params={"action":"query","list":"search","srsearch":query,"srlimit":3,"format":"json"},timeout=6)
        r.raise_for_status()
        return [x["title"] for x in r.json().get("query",{}).get("search",[])]
    except Exception:
        return []

@app.get("/api/health")
def health():
    return {"ok":True,"ai_configured":bool(API_KEY),"model":MODEL,"service":"MyAI / JARVIS X"}

@app.post("/api/ask")
def ask(body:Ask):
    if not API_KEY:
        return {"answer":"The backend is running, but AI_API_KEY is not configured. Add your private key to .env and restart the server."}
    messages=[{"role":"system","content":SYSTEM}]
    if body.context:
        try:
            history=__import__("json").loads(body.context)
            for item in history[-10:]:
                if item.get("role") in ("user","assistant"):
                    messages.append({"role":item["role"],"content":str(item.get("content",""))[:12000]})
        except Exception:
            pass
    messages.append({"role":"user","content":body.message})
    wiki=live_wikipedia(body.message)
    if wiki:
        messages[-1]["content"] += "\nPublic reference titles for context: "+", ".join(wiki)
    payload={"model":MODEL,"messages":messages,"temperature":0.3}
    try:
        r=requests.post(BASE_URL+"/chat/completions",headers={"Authorization":"Bearer "+API_KEY,"Content-Type":"application/json"},json=payload,timeout=90)
        r.raise_for_status()
        data=r.json()
        return {"answer":data["choices"][0]["message"]["content"]}
    except Exception:
        return {"answer":"The AI service could not be reached. Check your API settings, model name and internet connection."}

if __name__=="__main__":
    import uvicorn
    uvicorn.run("jarvis_server:app",host="127.0.0.1",port=8000,reload=True)
