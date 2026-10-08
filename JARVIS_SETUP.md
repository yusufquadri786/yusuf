# JARVIS X — Backend & API Key Setup

## Important security rule
Your real AI API key is a private password. **Do not send it in chat and do not put it in GitHub.** The repository contains only .env.example.

## Windows setup

1. Download or clone this GitHub repository to your PC.
2. Install Python 3.
3. Open the repository folder.
4. Copy .env.example and rename the copy to .env.
5. Open .env.
6. Replace your_private_key_here with the API key from the AI provider you choose.
7. Keep .env on your PC only.
8. Double-click start_jarvis.bat.
9. Open jarvis.html in Chrome or Edge.
10. In JARVIS Settings, use:
   http://127.0.0.1:8000

## What the backend does

Browser -> FastAPI backend -> AI provider -> JARVIS response

The browser never receives the private AI key. This prevents the key from being exposed in frontend JavaScript.

## Supported configuration

AI_BASE_URL should point to an OpenAI-compatible /v1 API endpoint.

AI_MODEL is the exact model name supplied by your provider.

Example structure:

AI_API_KEY=YOUR_PRIVATE_KEY
AI_BASE_URL=https://api.example.com/v1
AI_MODEL=YOUR_MODEL_NAME

Do not commit your real .env file.

## If a key is leaked

Immediately revoke or rotate it in the provider dashboard. Never paste the replacement key into GitHub source files.
