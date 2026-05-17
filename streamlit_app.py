from pathlib import Path
import os
import runpy
import sys


APP_DIR = Path(__file__).resolve().parent / "Multiple-Disease-Prediction-Webapp" / "Frontend"
APP_FILE = APP_DIR / "app.py"

if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))

os.chdir(APP_DIR)
runpy.run_path(str(APP_FILE), run_name="__main__")
