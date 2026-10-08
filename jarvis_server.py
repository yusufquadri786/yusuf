import os
from typing import Optional
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
app=FastAPI(title="JARVIS X Backend")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"])

API_KEY=os.getenv("AI_API_KEY","")
BASE_URL=os.getenv("AI_BASE_URL","https://api.openai.com/v1").rstrip("/")
MODEL=os.getenv("AI_MODEL","gpt-5.6-mini")
SYSTEM=("You are JARVIS X, an original helpful AI assistant. Be accurate and clear. "
        "You do not know everything and must say when information may be outdated. "
        "Never claim to have performed an action you did not perform. Keep answers appropriate for a school-age user.")

class Ask(BaseModel):
    message:str
    context:Optional[str]=None

def live_wikipedia(query:str):
    try:
        r=requests.get("https://en.wikipedia.org/w/api.php",params={
            "action":"query","list":"search","srsearch":query,"srlimit":3,"format":"json"
        },timeout=6)
        r.raise_for_status()
        return [x["title"] for x in r.json().get("query",{}).get("search",[])]
    except Exception:
        return []

@app.get("/api/health")
def health():
    return {"ok":True,"ai_configured":bool(API_KEY),"model":MODEL}

@app.post("/api/ask")
def ask(body:Ask):
    if not API_KEY:
        return {"answer":"JARVIS backend is running, but AI_API_KEY is not configured yet. Add it to .env, then restart the server."}
    prompt=body.message
    wiki=live_wikipedia(prompt)
    if wiki:
        prompt += "\nPublic knowledge search titles that may help: "+", ".join(wiki)
    payload={"model":MODEL,"messages":[{"role":"system","content":SYSTEM},{"role":"user","content":prompt}],"temperature":0.3}
    try:
        r=requests.post(BASE_URL+"/chat/completions",headers={"Authorization":"Bearer "+API_KEY,"Content-Type":"application/json"},json=payload,timeout=60)
        r.raise_for_status()
        data=r.json()
        answer=data["choices"][0]["message"]["content"]
        return {"answer":answer}
    except Exception as e:
        return {"answer":"The AI service could not be reached. Check your API settings and internet connection."}

if __name__=="__main__":
    import uvicorn
    uvicorn.run("jarvis_server:app",host="127.0.0.1",port=8000,reload=True)
