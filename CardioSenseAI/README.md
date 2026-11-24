# CardioSense AI

Project scaffold only — no application logic has been implemented yet.

## Structure

```
CardioSenseAI/
  frontend/
    public/
    src/
      assets/
      components/
      pages/
      hooks/
      context/
      services/
      styles/
      utils/
      App.jsx
      main.jsx
    package.json
    vite.config.js
    tailwind.config.js
    postcss.config.js
    index.html
  backend/
    app/
      routes/
      services/
      serial/
      storage/
      models/
      utils/
    data/
      readings.json
      analytics.json
    main.py
    requirements.txt
    .env.example
```

## Setup

**Backend**
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```
cd frontend
npm install
npm run dev
```
