# 🌦️ Capacity Connect — IMD Operational Workforce & Training Portal
> **Smart India Hackathon (SIH) | Problem ID: SIH26075 | Team Necto_404**  
> Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD)

---

## 🚀 Quick Start with Docker

Capacity Connect is fully containerized with a production multi-stage build using **Alpine Node 20** and **Nginx 1.27**, listening strictly on **Port 3000** with integrated health checks, gzip compression, and security headers.

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and spin up the container in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f

# Verify container health
docker compose ps
```
The application will be accessible at: **`http://localhost:3000`**

### Option 2: Using the Docker CLI Directly
```bash
# 1. Build the Docker image
docker build -t capacity-connect-portal:latest .

# 2. Run container on Port 3000
docker run -d --name capacity-connect-app -p 3000:3000 capacity-connect-portal:latest

# 3. Check health status
curl http://localhost:3000/health
```

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

The portal features a **Central National Gateway** enforcing strict Directorate Role-Based Access Control across three operational tracks:

| Role / Operational Track | Authorized Persona | Official Email | Credentials / PIN | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Trainee (Cadet)** | Julianne Moore *(Falcon L4 Forecaster)* | `cadet.julianne@imd.gov.in` | Password: `cadet2026` | 360° Doppler radar simulator, 6-axis competency radar, 15s Rapid Quiz Arena, animal rank streaks, video masterclasses. *(Restricted from Admin desk)* |
| **Trainer (Senior Faculty)** | Dr. Someshwar Rao *(CTI Pune Lead)* | `faculty.someshwar@imd.gov.in` | Password: `faculty2026` | Upload demo video masterclasses, publish radar calibration SOPs, student batch grading, faculty resume dossier. |
| **Admin (Director General)** | Dr. M. Mohapatra *(DGM Apex Command)* | `dg.mohapatra@imd.gov.in` | Directorate PIN: `IMD-ADMIN` | Statutory approvals & requisitions, national 37-radar override control, multi-console inspection, forecaster commissioning. |

### 🛡️ Security Features
- **Directorate Clearance Modal (MoES Protocol 403):** Learners or unauthorized sessions attempting to switch to the Admin Governance Desk are intercepted with a secure PIN prompt (`IMD-ADMIN`).
- **Input Validation:** Real-time email syntax verification, minimum password length enforcement, and clearance authorization toasts.
- **SIH Evaluator Quick-Access Bar:** An instant 1-click test bar at the base of the gateway allows hackathon evaluators to test all three cockpit perspectives seamlessly.

---

## 📦 Container Specifications
- **Base Image:** `node:20-alpine` (builder) ➔ `nginx:1.27-alpine` (runner)
- **Container Port:** `3000`
- **Health Check Endpoint:** `GET /health` ➔ `{"status":"UP","service":"capacity-connect-portal"}`
- **Security Headers:** `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`
