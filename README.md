# 🚨 ResQAI

**An AI-powered multi-agency emergency response and command platform that enables real-time coordination between Medical Services, Law Enforcement, Fire & Rescue, and Defense agencies.**

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

ResQAI centralizes emergency operations into a single AI-assisted command platform, enabling faster incident assessment, seamless inter-agency collaboration, and real-time operational awareness.

---

##  Features

###  AI-Powered Triage
Incoming SOS reports are analyzed using a Python and spaCy NLP engine to automatically classify emergency severity into **Critical**, **High**, **Medium**, or **Low** within seconds.

###  Real-Time Operations
Live incident updates, status changes, and AI assessments are synchronized instantly across the command dashboard using Supabase Realtime.

###  Operational Dashboard
Monitor active emergencies, responder availability, high-priority incidents, and response-time metrics through an interactive command interface.

### 📸 Evidence Management
Citizens can securely upload photos and audio evidence, stored in protected Supabase Storage buckets with Row Level Security (RLS).

###  Modern Command Center UI
A responsive dark-themed interface built with Tailwind CSS, inspired by professional emergency operations centers.

---

## 🏗️ Architecture

```
Citizen Report
      │
      ▼
 Next.js Frontend
      │
      ▼
 Supabase Database
      │
      ├── Storage (Media)
      ├── Webhooks
      ▼
 FastAPI AI Service
      │
      ▼
 spaCy NLP Analysis
      │
      ▼
 Severity Update
      │
      ▼
 Supabase Realtime
      │
      ▼
 Command Dashboard
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js**
- **React**
- **Tailwind CSS**
- **Supabase JavaScript SDK**

### Backend & Infrastructure
- **Supabase PostgreSQL**
- **Supabase Storage**
- **Supabase Realtime**
- **Database Webhooks**

### AI Service
- **Python**
- **FastAPI**
- **spaCy NLP**
- **Render**
---
🚀 Getting Started
Prerequisites
Node.js (v18+)
Python (3.11+)
A Supabase Account
A Render Account
1. Database Setup (Supabase)
Create a new Supabase project.
Run the SQL commands to generate the `sos\_reports` and `responders` tables.
Create a Storage bucket named `sos\_media` and configure the RLS policies (Public Insert, Authenticated Select).
2. Run the Command Center (Frontend)
```bash
git clone https://github.com/your-username/resqai-web.git
cd resqai-web
npm install
cp .env.example .env.local
# Add your NEXT\_PUBLIC\_SUPABASE\_URL and NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY
npm run dev
```
3. Run the AI Engine (Backend Microservice)
```bash
cd resqai-engine
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\\Scripts\\activate

pip install -r requirements.txt
python -m spacy download en\_core\_web\_sm

# Add your SUPABASE\_URL and SUPABASE\_SERVICE\_ROLE\_KEY

uvicorn main:app --reload
```
> \*\*Note:\*\* For production, the AI engine is configured to deploy directly to Render using Python 3.11.9 to ensure smooth compilation of the spaCy C++ dependencies.
---

## 🔒 Security & Privacy

### Row Level Security (RLS)
Supabase Row Level Security policies ensure that citizen reports can be submitted publicly while restricting access to sensitive incident data to authenticated and authorized personnel only.

### Secure AI Integration
The AI triage service communicates with Supabase using a securely managed Service Role Key, allowing trusted server-side operations while preventing unauthorized access or manipulation of incident classifications.

### Protected Evidence Storage
Uploaded photos and audio files are stored in secure Supabase Storage buckets with access controlled through authentication and RLS policies, ensuring sensitive evidence remains protected.

---
📌 Closing Statement
Designed for synchronization. Built for speed.
We consider it a privilege to coordinate multi-agency emergency responses.
