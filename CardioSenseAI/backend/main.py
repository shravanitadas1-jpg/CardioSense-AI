from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import vitals, history, analytics
from app.mqtt.mqtt_reader import mqtt_reader


@asynccontextmanager
async def lifespan(app: FastAPI):
    mqtt_reader.start()
    yield
    mqtt_reader.stop()


app = FastAPI(title="CardioSense AI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vitals.router)
app.include_router(history.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "CardioSense AI Backend"}