🚨 ResQAI: Multi-Agency Tactical Operations Command
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
ResQAI is an AI-powered synchronization network designed to bridge the gap between chaos and coordination. It centralizes emergency operations, allowing Medical, Law Enforcement, Fire & Rescue, and Defense forces to operate under a single, real-time command matrix.
✨ Core Features
🧠 AI-Powered Triage Engine: Incoming citizen SOS reports are instantly intercepted by a Python/spaCy Natural Language Processing (NLP) microservice. The AI assesses the threat level and automatically grades the severity (Critical, High, Medium, Low) in under a second.
⚡ Sub-Second Real-Time Feed: Utilizing Supabase WebSockets, the command dashboard updates instantly without page refreshes. New emergencies, AI grading updates, and status changes pulse onto the operator's screen the millisecond they happen.
📊 Live Tactical Telemetry: The KPI dashboard automatically calculates and displays the system's active high-severity threats, total active responders, and the average system response time across the entire database.
📸 Secure Evidence Vault: Citizens can attach rich media (photos, audio) to their SOS reports. Files are routed to secure Supabase Storage buckets governed by strict Row Level Security (RLS), ensuring only authenticated command operators can view victim data.
🌑 Cinematic Command UI: Built with Tailwind CSS, featuring a dark-mode, glassmorphism aesthetic tailored for low-light, high-stress command center environments.
---
🏗️ System Architecture
ResQAI operates on a decoupled, event-driven microservice architecture:
Ingestion: A citizen submits an SOS report (text + media) via the Next.js frontend.
Storage & Event Trigger: The report is saved to Supabase (PostgreSQL) with a `PENDING` status. Supabase immediately fires a Webhook containing the row data.
AI Analysis: The Webhook hits the isolated Python/FastAPI engine hosted on Render. The `spaCy` NLP model analyzes the text, assigns a severity grade, and pushes the update back to Supabase.
Real-Time Broadcast: Supabase detects the database update and broadcasts the change via WebSockets to the Next.js Command Center, instantly updating the operator's Live Operations Feed.
---
💻 Tech Stack
Frontend (Command Center)
Framework: Next.js (React)
Styling: Tailwind CSS
Real-time & Auth: Supabase-js Client
Backend (Database & Infrastructure)
Database: Supabase (PostgreSQL)
Storage: Supabase Storage (S3-compatible)
Event Routing: Supabase Database Webhooks
AI Microservice (Triage Engine)
Framework: Python FastAPI
NLP Engine: spaCy (`en\_core\_web\_sm`)
Hosting: Render (Cloud Web Service)
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
🔒 Security & Privacy
Row Level Security (RLS): Citizen submissions are public-write, but strictly authenticated-read.
Data Integrity: The AI microservice communicates with the database using a secure Service Role Key, preventing unauthorized API grading manipulation.
---
📌 Closing Statement
Designed for synchronization. Built for speed.
We consider it a privilege to coordinate multi-agency emergency responses.