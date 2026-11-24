from datetime import datetime


def now_date_str() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def now_time_str() -> str:
    return datetime.now().strftime("%H:%M:%S")


def now_iso() -> str:
    return datetime.now().isoformat()


def classify_ces(value: int) -> str:
    if value <= 40:
        return "Poor"
    if value <= 60:
        return "Moderate"
    if value <= 80:
        return "Good"
    return "Optimized"


def safe_avg(values, default: float = 0.0) -> float:
    values = [v for v in values if v is not None]
    if not values:
        return default
    return sum(values) / len(values)


def clamp(value, min_value, max_value):
    return max(min_value, min(max_value, value))


def recovery_to_score(label: str) -> int:
    mapping = {
        "Excellent": 95,
        "Good": 80,
        "Moderate": 60,
        "Poor": 35,
    }
    return mapping.get(label, 60)