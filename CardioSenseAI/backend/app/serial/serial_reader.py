import json
import os
import threading
import time
from datetime import datetime
from typing import Optional

import serial
from dotenv import load_dotenv

load_dotenv()

COM_PORT = os.getenv("COM_PORT", "COM9")
BAUD_RATE = int(os.getenv("BAUD_RATE", "115200"))
RECONNECT_DELAY_SECONDS = 3


class SerialReader:
    """
    Reads JSON lines from the ESP32 over a serial connection in a background
    thread, keeps the latest parsed reading in memory, and reconnects
    automatically if the port disconnects. Invalid/malformed lines are
    ignored.
    """

    def __init__(self, port: str = COM_PORT, baud_rate: int = BAUD_RATE):
        self.port = port
        self.baud_rate = baud_rate
        self._serial: Optional[serial.Serial] = None
        self._thread: Optional[threading.Thread] = None
        self._running = False
        self._lock = threading.Lock()
        self._latest = {
            "heartRate": 0,
            "spo2": 0,
            "temperature": 0.0,
            "cardiacAge": 0,
            "ces": 0,
            "ecg": 0,
            "fingerDetected": False,
            "connection": "offline",
            "sensor": "MAX30102 / AD8232",
            "lastUpdated": None,
        }

    def start(self):
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._serial and self._serial.is_open:
            try:
                self._serial.close()
            except Exception:
                pass
        with self._lock:
            self._latest["connection"] = "offline"

    def get_latest(self) -> dict:
        with self._lock:
            return dict(self._latest)

    def _run(self):
        while self._running:
            try:
                self._connect()
                self._read_loop()
            except Exception:
                with self._lock:
                    self._latest["connection"] = "offline"
                time.sleep(RECONNECT_DELAY_SECONDS)

    def _connect(self):
        with self._lock:
            self._latest["connection"] = "connecting"
        self._serial = serial.Serial(self.port, self.baud_rate, timeout=1)
        with self._lock:
            self._latest["connection"] = "connected"

    def _read_loop(self):
        while self._running and self._serial and self._serial.is_open:
            try:
                raw_line = self._serial.readline()
            except serial.SerialException:
                raise

            if not raw_line:
                continue

            self._process_line(raw_line)

    def _process_line(self, raw_line: bytes):
        try:
            decoded = raw_line.decode("utf-8", errors="ignore").strip()
        except Exception:
            return

        if not decoded.startswith("{") or not decoded.endswith("}"):
            return

        try:
            payload = json.loads(decoded)
        except json.JSONDecodeError:
            return

        with self._lock:
            self._latest.update(
                {
                    "heartRate": int(payload.get("heartRate", self._latest["heartRate"])),
                    "spo2": int(payload.get("spo2", self._latest["spo2"])),
                    "temperature": float(payload.get("temperature", self._latest["temperature"])),
                    "cardiacAge": int(payload.get("cardiacAge", self._latest["cardiacAge"])),
                    "ces": int(payload.get("ces", self._latest["ces"])),
                    "ecg": int(payload.get("ecg", self._latest["ecg"])),
                    "fingerDetected": bool(payload.get("fingerDetected", self._latest["fingerDetected"])),
                    "connection": "connected",
                    "lastUpdated": datetime.now().isoformat(),
                }
            )


serial_reader = SerialReader()