# CardioSense AI

### Your heart has a story. We help you read it.

**A privacy-first personal health intelligence system that connects cardiovascular data with everyday lifestyle habits to deliver meaningful, personalized insights.**

| Hackathon Details | |
|---|---|
| Event | wHACKiest 2026 |
| Track | Track 03 – Know Thyself. Your Data. Your Intelligence. |
| Team | Ayush Care |
| Institution | The Oxford College of Engineering, Bengaluru |

## 1. Problem Statement

Modern smartphones, smartwatches and fitness trackers collect enormous amounts of personal health data. However, users often struggle to understand what these measurements mean in the context of their everyday lives.

Fragmented health information, generic recommendations and privacy concerns limit the practical value of personal health data.

**People have access to their data, but not always to meaningful intelligence.**

## 2. Our Solution

CardioSense AI aims to transform raw cardiovascular and lifestyle data into actionable, personalized insights through three core pillars:

- **Connect:** Bring cardiovascular measurements, wearable data and lifestyle information into one unified platform.
- **Understand:** Learn individual health patterns, identify deviations and explore relationships between habits and cardiovascular measurements.
- **Protect:** Prioritize user privacy, local data processing, informed consent and responsible AI.

## 3. A Real-World Use Case

Meet Riya, an engineering student preparing for her examinations.

Over two weeks, her resting heart rate increases by 8 BPM, while her average sleep duration decreases to 5.2 hours.

Instead of simply displaying these measurements, CardioSense AI aims to identify the relationship between these changes and provide a contextual insight:

> Your resting heart rate has increased alongside reduced sleep over the past two weeks. Consider prioritizing adequate sleep and monitoring subsequent changes.

This illustrative scenario demonstrates how CardioSense AI intends to bridge the gap between health monitoring and personal health intelligence.

## 4. Current Prototype

The existing CardioSense AI prototype provides the technical foundation for our proposed solution.

### Hardware

- ESP32 microcontroller
- MAX30102 heart rate and SpO₂ sensor
- AD8232 ECG sensor
- OLED display

### Software

- Interactive cardiovascular health dashboard
- Heart rate and SpO₂ visualization
- ECG visualization interface
- Health analytics interface
- Historical readings interface
- FastAPI backend
- Local JSON-based data storage implementation
- Serial communication infrastructure

The hardware has undergone previous prototype testing. The frontend and backend have been successfully started locally. Complete hardware-to-database integration has not been reverified during the current submission session.

## 5. Proposed Hackathon Development

CardioSense AI will be extended through the following seven interconnected modules:

| Module | Purpose |
|---|---|
| Unified Health Data Hub | Integrate cardiovascular and lifestyle information |
| Personalized Health Dashboard | Present individual health trends |
| Adaptive Personal Health Model | Establish personal baselines and identify deviations |
| Habit-to-Heart Intelligence Engine | Explore relationships between lifestyle habits and cardiovascular measurements |
| Personal AI Health Assistant | Provide contextual, understandable health insights |
| Context-Aware Smart Nudges | Deliver relevant wellness suggestions |
| Personal Health Data Vault | Enable local storage, consent management and data ownership |

## 6. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Visualization | Chart.js |
| Communication | Serial communication, REST APIs |
| Hardware | ESP32, MAX30102, AD8232, OLED |
| Current Storage | Local JSON files |
| Proposed Database | SQLite |
| Proposed Data Analytics | Python, Pandas and statistical analysis |
| Proposed AI Layer | Context-aware AI with consent-based access |

## 7. Proposed System Architecture

```text
Cardiovascular Sensors     Lifestyle Data
          |                      |
        ESP32              CSV / Manual Input
          |                      |
          +----------+-----------+
                     |
              Data Validation
                     |
             Local Health Vault
                     |
          Personal Intelligence Engine
                     |
       +-------------+--------------+
       |             |              |
   Dashboard    AI Assistant    Smart Nudges
```

External AI processing, if enabled, will be subject to explicit user consent and selective data disclosure.

## 8. Privacy and Responsible AI

Privacy is a fundamental design principle of CardioSense AI.

Our proposed privacy and safety framework includes:

- Local-first health data storage.
- Explicit consent before external data sharing.
- Selective disclosure of necessary information.
- User-controlled data export and deletion.
- Validation of incomplete or unreliable readings.
- Explainable, evidence-grounded insights.
- Non-diagnostic health recommendations.

CardioSense AI aims to empower users without compromising their ownership of personal health information.

## 9. Getting Started

### Prerequisites

- Node.js and npm
- Python 3
- Git
- Compatible ESP32-based hardware for live sensor acquisition

### Clone the Repository

```bash
git clone https://github.com/shravanitadas1-jpg/CardioSense-AI.git
cd CardioSense-AI/CardioSenseAI
```

### Start the Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend URL:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

### Start the Frontend

Open a separate terminal from the repository root.

```bash
cd CardioSenseAI/frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, typically:

http://localhost:5173

### Hardware Configuration

For live cardiovascular measurements, connect the ESP32-based prototype and configure the appropriate serial port using the backend environment configuration.

The default example configuration uses COM9 and a baud rate of 115200. Update the serial port according to your system.

The frontend can be explored without hardware. Live physiological measurements require the physical sensor setup and compatible firmware.

## 10. Expected Impact

- Improved understanding of personal health patterns.
- Increased awareness of lifestyle and cardiovascular relationships.
- Accessible personal wellness intelligence.
- Reduced dependence on fragmented health applications.
- Greater user control over sensitive health information.
- Affordable and scalable cardiovascular monitoring.

## 11. Future Scope

- Smartwatch and fitness tracker integration.
- Advanced personalized health modelling.
- Longitudinal cardiovascular trend analysis.
- Privacy-preserving AI processing.
- Progressive development towards a digital cardiac twin.

## 12. Team Ayush Care

**The Oxford College of Engineering**  
Department of Electronics and Communication Engineering

| Team Member | USN |
|---|---|
| Prapthi Kharat – Team Lead | 1OX25EC055 |
| Shravani Tadas | 1OX25EC069 |
| Sunaina H Somanapalli | 1OX25EC080 |
| Vinutha | 1OX25EC085 |

## 13. Project Status and Disclosure

CardioSense AI builds upon a pre-existing student-developed cardiovascular monitoring prototype.

The personal intelligence engine, lifestyle integration, adaptive health modelling and enhanced privacy framework represent the proposed development scope for wHACKiest 2026, subject to the event's eligibility rules.

## Disclaimer

CardioSense AI is an educational and research prototype intended for personal wellness awareness. It is not a clinically validated medical device and is not intended for diagnosis, treatment or replacement of professional medical advice.

---

**Your Data. Your Health. Your Intelligence.**

Developed by Team Ayush Care.
