# JARVIS X — AI Command Center

JARVIS X is an original JARVIS-inspired assistant module for this repository.

## Included
- Futuristic animated command-center UI
- Voice input with browser Speech Recognition
- Voice output with Speech Synthesis
- Local fallback answers
- Python FastAPI backend
- Optional cloud AI through an OpenAI-compatible API
- Public Wikipedia search used as extra context
- No API key stored in frontend code

## Run the interface
Open `jarvis.html` in a modern Chromium-based browser.

## Run full AI mode
1. Install Python.
2. In a terminal inside this repository run:
   `pip install -r requirements-jarvis.txt`
3. Copy `.env.example` to `.env`.
4. Put your private API key in `.env`.
5. Start:
   `python jarvis_server.py`
6. Open `jarvis.html`.
7. If needed, open Settings and keep Backend URL as `http://127.0.0.1:8000`.

## Important
JARVIS cannot literally know everything in the world. A strong assistant combines an AI model, live web/data sources, memory, tools, and careful verification. API keys must stay on the server, never inside `jarvis.js`.

## Roadmap
- Real-time web search connector
- Weather/news/maps connectors
- Persistent user memory
- Tool calling
- Desktop controls with explicit user permission
- Better wake-word support
- 3D WebGL/HUD interface
- Authentication and secure backend
- Optional multiplayer/cloud deployment
