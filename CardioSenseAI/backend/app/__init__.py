import json
import threading
from datetime import datetime

import paho.mqtt.client as mqtt


MQTT_BROKER = "127.0.0.1"
MQTT_PORT = 1883
MQTT_TOPIC = "cardiosense/vitals"


class MQTTReader:

    def __init__(self):
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

        self.client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2
        )

        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect

    def start(self):
        try:
            print("Connecting to MQTT broker...")

            self.client.connect(
                MQTT_BROKER,
                MQTT_PORT,
                60
            )

            self.client.loop_start()

        except Exception as e:
            print("MQTT connection error:", e)

    def stop(self):
        try:
            self.client.loop_stop()
            self.client.disconnect()
        except Exception:
            pass

        with self._lock:
            self._latest["connection"] = "offline"

    def get_latest(self):
        with self._lock:
            return dict(self._latest)

    def _on_connect(
        self,
        client,
        userdata,
        flags,
        reason_code,
        properties
    ):
        if reason_code == 0:
            print("MQTT connected")

            client.subscribe(MQTT_TOPIC)

            print(
                "Subscribed to:",
                MQTT_TOPIC
            )

            with self._lock:
                self._latest["connection"] = "connected"

        else:
            print(
                "MQTT connection failed:",
                reason_code
            )

    def _on_disconnect(
        self,
        client,
        userdata,
        disconnect_flags,
        reason_code,
        properties
    ):
        print("MQTT disconnected")

        with self._lock:
            self._latest["connection"] = "offline"

    def _on_message(
        self,
        client,
        userdata,
        message
    ):
        try:
            decoded = message.payload.decode("utf-8")

            print("MQTT received:", decoded)

            payload = json.loads(decoded)

            with self._lock:

                self._latest.update({
                    "heartRate": int(
                        payload.get(
                            "heartRate",
                            self._latest["heartRate"]
                        )
                    ),

                    "spo2": int(
                        payload.get(
                            "spo2",
                            self._latest["spo2"]
                        )
                    ),

                    "temperature": float(
                        payload.get(
                            "temperature",
                            self._latest["temperature"]
                        )
                    ),

                    "cardiacAge": int(
                        payload.get(
                            "cardiacAge",
                            self._latest["cardiacAge"]
                        )
                    ),

                    "ces": int(
                        payload.get(
                            "ces",
                            self._latest["ces"]
                        )
                    ),

                    "ecg": int(
                        payload.get(
                            "ecg",
                            self._latest["ecg"]
                        )
                    ),

                    "fingerDetected": bool(
                        payload.get(
                            "fingerDetected",
                            self._latest["fingerDetected"]
                        )
                    ),

                    "connection": "connected",

                    "lastUpdated":
                        datetime.now().isoformat()
                })

        except Exception as e:
            print("MQTT message error:", e)


mqtt_reader = MQTTReader()