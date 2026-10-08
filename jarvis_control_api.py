from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jarvis_controller import handle

app = FastAPI(title="JARVIS X Safe Controller")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class ControlRequest(BaseModel):
    action: str
    target: str = ""

@app.get("/api/control/health")
def health():
    return {"ok": True, "service": "JARVIS X Safe Controller"}

@app.get("/api/control/system")
def system():
    ok, data = handle("system_info")
    return {"ok": ok, "data": data}

@app.post("/api/control")
def control(req: ControlRequest):
    ok, result = handle(req.action, req.target)
    return {"ok": ok, "result": result}
