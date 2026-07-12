# 🚨 ResQAI: Multi-Agency Emergency Response & Smart Command Platform

**An AI-assisted, real-time command-and-control platform designed to synchronize incident reporting, triage, and responder dispatching between Medical Services, Fire & Rescue, Law Enforcement, and Defense agencies.**

---

## 📸 Platform Modules

ResQAI consists of three main modules designed to work in seamless synchronization:

1. **💻 Next.js Command Center (Web Frontend)**: The central dashboard for emergency coordinators, featuring live crisis mapping, automated triage cues, and proximity-based dispatch workflows.
2. **📱 Expo Universal App (Mobile App)**: A mobile application built with React Native and Expo, featuring a **Citizen Panel** for immediate SOS reporting and a **Responder Hub** for field coordinators.
3. **🧠 FastAPI AI Engine (Backend Microservice)**: A Python FastAPI service that parses incoming SOS descriptions via Natural Language Processing (NLP) to compute incident severity instantly.

---

## ✨ Features

### 📡 Live Operations & Real-Time Sync
* Real-time PostgreSQL socket replication powered by **Supabase WebSockets**.
* Instant dashboard updates for incoming alerts, dispatch confirmations, and responder status changes.

### 🗺️ Interactive Crisis Mapping
* **Leaflet & React-Leaflet** integration visualizing emergency coordinates.
* Interactive pulse markers showing real-time active incident locations.

### 🧠 AI-Powered NLP Triage
* Back-end microservice utilizing **spaCy NLP** for semantic parsing.
* Extracts key root terms (lemmas) to automatically classify alerts into **Critical**, **High**, **Medium**, or **Low** severity in seconds.

### 📍 Proximity-Based Dispatch (Nearest First)
* Integrates the **Haversine Formula** to compute the exact spherical distance between any active incident and nearby available responders.
* Automatically sorts available responders on the dispatch desk so operators can deploy the **nearest unit** instantly.
* Displays live distance tags (e.g., `📍 1.25 km away`) to aid deployment decisions.

### 🚔 Responder GPS Onboarding
* Allows personnel to self-register and update their status.
* Utilizes the **HTML5 Geolocation API** to fetch field GPS coordinates with a single click, with manual entry coordinates as a fallback.

---

## 🏗️ Architecture

```
                      ┌─────────────────────────┐
                      │    Citizen Mobile App   │
                      └────────────┬────────────┘
                                   │
                                   ▼
                      ┌─────────────────────────┐
                      │    Next.js Frontend     │
                      └────────────┬────────────┘
                                   │
                                   ▼
                      ┌─────────────────────────┐
                      │    Supabase Postgres    │
                      └────────────┬────────────┘
                                   │
                                   ├── Webhooks (on INSERT)
                                   ▼
                      ┌─────────────────────────┐
                      │   FastAPI AI Service    │
                      └────────────┬────────────┘
                                   │
                       Updates Status (Triage)
                                   ▼
                      ┌─────────────────────────┐
                      │    Supabase Realtime    │
                      └────────────┬────────────┘
                                   │
                       Pushes Live State Updates
                                   ▼
                      ┌─────────────────────────┐
                      │    Command Center UI    │
                      └─────────────────────────┘
```

---

## 🛠️ Tech Stack

| Module | Core Technologies |
| :--- | :--- |
| **Command Center (Web)** | Next.js 16 (App Router), React 19, Leaflet Map, Supabase Client JS, Vanilla CSS / Tailwind CSS |
| **Mobile App** | React Native, Expo, Expo Router, Expo Linear Gradient |
| **AI Engine (Service)** | Python 3.11+, FastAPI, spaCy NLP (`en_core_web_sm`), Uvicorn |
| **Database & Auth** | Supabase (PostgreSQL), WebSockets Realtime replication, Row Level Security (RLS) |

---

## 📂 Directory Structure

```
ResQAI-web/
├── src/                          # Next.js Frontend source code
│   ├── app/                      # Page routing
│   │   ├── dashboard/            # Command center homepage
│   │   │   ├── dispatch/         # Smart Dispatch Desk (Proximity routing)
│   │   │   ├── responders/       # Crew directory & GPS onboarding
│   │   │   └── sos/              # Scroll-highlighted incoming logs
│   │   └── page.tsx              # Landing portal
│   └── lib/                      # Supabase client singleton configurations
├── resqai-mobile/                # React Native Expo mobile application
│   ├── src/
│   │   ├── app/
│   │   │   ├── citizen/          # Citizen SOS Form and SOS Status tracking
│   │   │   └── responder/        # Responder Hub onboarding & Live Alerts
│   └── package.json
├── resqai-ai-engine/             # Python NLP microservice
│   ├── main.py                   # FastAPI Server and webhook listeners
│   ├── nlp.py                    # spaCy keyword parsing logic
│   └── requirements.txt          # Python dependencies
├── supabase_schema.sql           # Database schema migrations & PL/pgSQL transaction functions
└── README.md                     # Master project overview
```

---

## 🚀 Installation & Local Setup

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.11+)
* **Supabase** Account

---

### Step 1: Database Setup (Supabase)
1. Initialize a new project in your Supabase Dashboard.
2. Navigate to the **SQL Editor** in Supabase and execute the queries from [supabase_schema.sql](file:///D:/OneDrive/Desktop/Nexio_ResQAI_HackElite3/ResQAI-web/supabase_schema.sql). This will:
   * Create the `sos_reports`, `responders`, and `dispatch_logs` tables.
   * Enable WebSocket Realtime replication on these tables.
   * Create the atomic transaction function `dispatch_responder(...)`.
   * Add initial seed responders with location coordinates in Sri Lanka.
3. Configure your local `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

---

### Step 2: Run the Next.js Command Center (Web Frontend)
1. Run the following command in the root folder to install the required map and client dependencies:
   ```bash
   npm install
   ```
2. Launch the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

### Step 3: Run the AI Engine (Backend Microservice)
1. Navigate to the AI engine folder:
   ```bash
   cd resqai-ai-engine
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies and download the spaCy model:
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```
4. Create a `.env` file in `resqai-ai-engine/` and supply your keys:
   ```env
   SUPABASE_URL=https://<your-project-id>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
5. Start the FastAPI microservice:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

---

### Step 4: Run the Mobile Application (React Native)
1. Navigate to the mobile app folder:
   ```bash
   cd resqai-mobile
   ```
2. Install Expo and React Native dependencies:
   ```bash
   npm install
   ```
3. Run the Expo development environment:
   ```bash
   npx expo start
   ```
4. Press `a` to open in an Android Emulator, `i` to open in an iOS Simulator, or scan the QR code using the Expo Go app on your physical mobile device.

---

## 🔒 Security & Privacy

* **Row Level Security (RLS)**: Public write permissions are restricted on sensitive resources. Citizens can file SOS reports, but only verified personnel are granted dispatcher access.
* **Atomic Transactions**: Personnel assignments are carried out in a secure PL/pgSQL transaction database function, guaranteeing that busy responders cannot be dispatched to multiple incidents at the same time.
