# JARVIS X — Safe Laptop Control

This module lets your local JARVIS perform a small set of explicit Windows actions.

## Supported actions
- Open Notepad
- Open Calculator
- Open Paint
- Open File Explorer
- Open Desktop, Documents or Downloads
- Open Google, YouTube or GitHub
- Read basic system information

It intentionally does **not** provide arbitrary command execution, unrestricted file deletion/editing, credential access, or hidden background control.

## Run
Install the existing JARVIS requirements, then run:

```text
python -m uvicorn jarvis_control_api:app --host 127.0.0.1 --port 8010
```

The controller is local-only on 127.0.0.1.

## Example
POST to `http://127.0.0.1:8010/api/control` with:

```json
{"action":"open_app","target":"calculator"}
```

