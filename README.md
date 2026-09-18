# ElderCare – Elderly Nursing & Healthcare Assistance Platform

> **Compassionate, verified in-home elderly nursing, attendants, physiotherapists, and post-hospital convalescent care.**

![ElderCare Platform Banner](https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview

**ElderCare** connects aging seniors and their families with **verified registered nurses, caregivers, physiotherapists, and attendants** for dignified home care. It features a complete booking lifecycle, real-time clinical care notes & vitals tracking, senior-friendly accessibility controls, role-based dashboards, and platform governance.

> [!IMPORTANT]
> **Non-Emergency Medical Service Disclaimer**: ElderCare is designed for scheduled in-home care assistance. For life-threatening emergencies, users are instructed to dial **911** or contact local emergency services immediately.

---

## 🚀 Key Features

### 1. Senior Accessibility & Inclusivity
- **Senior Easy-Read Mode**: One-click text scaler (Standard, Large `A+`, Extra Large `A++`) and high-contrast styling.
- **Oversized Touch Targets**: 48px+ touch buttons with high visual contrast.
- **Text-to-Speech Voice Reader**: Audio accessibility reader for page summaries.
- **Persistent Emergency SOS Banner**: Quick access to 911 and national senior helpline hotlines.

### 2. Multi-Role User Workflows
- **Family / Client**:
  - Add & manage elderly patient profiles (medical history, chronic illnesses, allergies, mobility level, primary doctor).
  - Search & filter verified caregivers by service, location, rating, price, and experience.
  - Multi-step booking wizard (Hourly, Daily, Long-Term).
  - Live visit status timeline tracking.
  - View logged patient vitals (Blood Pressure, Blood Sugar, SpO2, Pulse, Temp, Meds).
  - 1-to-5 star ratings & review submission.
  - File dispute tickets in the Dispute Resolution Center.
- **Caregiver / Nurse**:
  - Manage professional profile (bio, rates, specializations, service areas).
  - Upload verification credentials (board licenses, Govt ID, CPR/BLS certifications).
  - Toggle live availability (`Available` vs `Busy`).
  - Accept or decline incoming booking requests.
  - Advance booking lifecycle (`On The Way` ➔ `Arrived` ➔ `In Progress` ➔ `Completed`).
  - Log patient vitals, medications administered, diet notes, and shift summary.
  - Payouts & work history analytics.
- **Admin**:
  - Platform analytics (GMV, platform commission, completed shifts, active bookings).
  - **Caregiver Verification Desk**: Review uploaded credentials, approve/reject, grant verified badges.
  - User & practitioner governance (search, activate, or suspend accounts).
  - Dispute mediation desk with resolution notes.

### 3. Booking Lifecycle State Machine
```
PENDING ➔ ACCEPTED ➔ ON_THE_WAY ➔ ARRIVED ➔ IN_PROGRESS ➔ COMPLETED
               ↳ REJECTED   ↳ CANCELLED   ↳ DISPUTED
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Date-fns |
| **Backend** | Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js |
| **Database & ORM** | PostgreSQL / SQLite (zero-config local dev), Prisma ORM |
| **Testing** | Jest, Supertest (16 automated tests) |
| **Containerization** | Docker, Docker Compose, Nginx |

---

## 🔑 Demo Accounts (1-Click Fast Login)

The application includes an instant **Demo Switcher** on the login page and navigation bar:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Family User** | `family@eldercare.com` | `Password123!` | Elderly patient management, bookings, reviews |
| **Verified Nurse** | `nurse.sarah@eldercare.com` | `Password123!` | Accept shifts, live status updater, vitals logger |
| **Physiotherapist** | `physio.rahul@eldercare.com` | `Password123!` | Geriatric physical therapy, mobility logs |
| **Care Attendant** | `attendant.priya@eldercare.com` | `Password123!` | Daily companionship, meal prep, hygiene support |
| **Platform Admin** | `admin@eldercare.com` | `Password123!` | Credential verification desk, analytics, disputes |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Clone & Install Dependencies
```bash
# Backend installation
cd backend
npm install

# Frontend installation
cd ../frontend
npm install
```

### 2. Database Migration & Realistic Seed
```bash
cd backend
npx prisma db push
npx ts-node prisma/seed.ts
```

### 3. Run Automated Tests
```bash
cd backend
npm test
```

### 4. Start Development Servers
In two separate terminals:

```bash
# Terminal 1: Backend Server (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🐳 Docker Deployment

To launch the complete multi-container stack with PostgreSQL, Backend, and Nginx-powered Frontend:

```bash
docker-compose up --build
```

- **Frontend Web App**: http://localhost:80
- **Backend API**: http://localhost:5000/api
- **PostgreSQL Database**: localhost:5432

---

## 📡 API Endpoints Summary

- `GET /api/health` — Service health & emergency disclaimer
- `POST /api/auth/register` — Register family or caregiver account
- `POST /api/auth/login` — JWT authentication
- `GET /api/auth/me` — Current authenticated user profile
- `GET /api/services` — Healthcare services list
- `GET /api/caregivers` — Search & filter caregivers
- `GET /api/patients` — List elderly family profiles
- `POST /api/patients` — Create patient health record
- `POST /api/bookings` — Create care booking request
- `PATCH /api/bookings/:id/status` — Advance lifecycle status
- `POST /api/care-notes` — Log patient vitals & care notes
- `POST /api/reviews` — Submit 5-star review
- `POST /api/complaints` — File dispute ticket
- `GET /api/admin/analytics` — Platform KPI revenue analytics
- `POST /api/admin/verifications/:id/review` — Approve/Reject caregiver licenses

---

## 📄 License
MIT License © 2026 ElderCare Health Technologies Inc.
