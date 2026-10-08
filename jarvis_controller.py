"""
JARVIS X — Safe Windows Controller
Only performs explicit, allow-listed actions. It does not execute arbitrary shell commands.
"""
import os, subprocess, webbrowser, platform, datetime
from pathlib import Path

ALLOWED_APPS = {
    "notepad": ["notepad.exe"],
    "calculator": ["calc.exe"],
    "paint": ["mspaint.exe"],
    "explorer": ["explorer.exe"],
}
ALLOWED_FOLDERS = {
    "desktop": Path.home() / "Desktop",
    "documents": Path.home() / "Documents",
    "downloads": Path.home() / "Downloads",
}
ALLOWED_SITES = {
    "google": "https://www.google.com",
    "youtube": "https://www.youtube.com",
    "github": "https://github.com",
}

def launch_app(name: str):
    name = name.lower().strip()
    if name not in ALLOWED_APPS:
        return False, "That app is not on the safe allow-list."
    subprocess.Popen(ALLOWED_APPS[name])
    return True, f"Opening {name}."

def open_folder(name: str):
    name = name.lower().strip()
    path = ALLOWED_FOLDERS.get(name)
    if not path:
        return False, "That folder is not on the safe allow-list."
    path.mkdir(parents=True, exist_ok=True)
    os.startfile(str(path))
    return True, f"Opening {name}."

def open_site(name: str):
    url = ALLOWED_SITES.get(name.lower().strip())
    if not url:
        return False, "That website is not on the safe allow-list."
    webbrowser.open(url)
    return True, f"Opening {name}."

def system_info():
    return {
        "os": platform.platform(),
        "computer": platform.node(),
        "processor": platform.processor(),
        "python": platform.python_version(),
        "time": datetime.datetime.now().isoformat(timespec="seconds"),
    }

def handle(action: str, target: str = ""):
    action = action.lower().strip()
    if action == "open_app": return launch_app(target)
    if action == "open_folder": return open_folder(target)
    if action == "open_site": return open_site(target)
    if action == "system_info": return True, system_info()
    return False, "Unknown or blocked action."
