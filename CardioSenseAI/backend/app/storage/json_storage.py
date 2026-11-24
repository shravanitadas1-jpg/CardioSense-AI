import json
import os
import threading
from typing import Any, List, Dict

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
READINGS_FILE = os.path.join(DATA_DIR, "readings.json")
ANALYTICS_FILE = os.path.join(DATA_DIR, "analytics.json")

_lock = threading.Lock()


def _ensure_data_dir():
    os.makedirs(DATA_DIR, exist_ok=True)


def _ensure_file(path: str, default: Any):
    _ensure_data_dir()
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump(default, f, indent=2)


def read_json(path: str, default: Any):
    _ensure_file(path, default)
    with _lock:
        try:
            with open(path, "r") as f:
                content = f.read().strip()
                if not content:
                    return default
                return json.loads(content)
        except (json.JSONDecodeError, FileNotFoundError):
            return default


def write_json(path: str, data: Any):
    _ensure_file(path, data)
    with _lock:
        with open(path, "w") as f:
            json.dump(data, f, indent=2)


def read_readings() -> List[Dict]:
    return read_json(READINGS_FILE, [])


def write_readings(readings: List[Dict]):
    write_json(READINGS_FILE, readings)


def append_reading(reading: Dict) -> Dict:
    readings = read_readings()
    readings.append(reading)
    write_readings(readings)
    return reading


def read_analytics() -> Dict:
    return read_json(ANALYTICS_FILE, {})


def write_analytics(data: Dict):
    write_json(ANALYTICS_FILE, data)