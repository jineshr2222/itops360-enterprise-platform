# ITOps360 – Enterprise IT Service & Analytics Platform

A portfolio-ready full-stack IT service management platform demonstrating software development, data analytics, cloud-ready architecture, automation, and ITSM concepts.

## Tech Stack
- Frontend: Vue 3 + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Analytics/automation: Python
- Reporting: Power BI-ready SQL views
- CI: GitHub Actions
- Cloud-ready: Microsoft Azure

## Core Features
- Incident/ticket creation and tracking
- Priority and status management
- Assignment to support engineers
- SLA calculation
- REST API
- Dashboard-ready metrics
- Python SLA report generation
- Docker-ready development setup

## Project Structure
```text
itops360/
├── frontend/
├── backend/
├── database/
├── python/
├── docs/
└── .github/workflows/
```

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The UI runs on the Vite development URL shown in the terminal.

### Database
Run `database/schema.sql` against PostgreSQL.

## API
- `GET /api/health`
- `GET /api/incidents`
- `POST /api/incidents`
- `PATCH /api/incidents/:id/status`

## Portfolio Notes
This project is intentionally designed to demonstrate enterprise-style engineering rather than a simple CRUD demo. It can be extended with authentication, Azure deployment, Power BI, ServiceNow integration, Docker, and CI/CD.
