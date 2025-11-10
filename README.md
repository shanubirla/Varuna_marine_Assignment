
# ⚓ FuelEU Maritime — Compliance Module (Frontend + Backend)

A complete **Fuel EU Maritime compliance platform** built with a **clean hexagonal architecture** across **frontend** and **backend**.  
Implements domain logic for **routes**, **compliance balance (CB)**, **banking**, and **pooling**, along with a **React + Tailwind** dashboard consuming backend APIs.

---

## 🧭 Overview

- **Frontend:** React + TypeScript + TailwindCSS (Vite)
- **Backend:** Node.js + TypeScript + Express + PostgreSQL
- **Architecture:** Hexagonal (Ports & Adapters / Clean Architecture)
- **Docs:**  
  - `AGENT_WORKFLOW.md` — AI agent workflow  
  - `REFLECTION.md` — reflection essay  
- **Testing:** Vitest for backend unit/integration tests  

---

## 🧱 Architecture

This project follows a strict **Hexagonal (Ports & Adapters)** architecture for clarity and testability.

```

backend/src/
├── core/
│    ├── domain/             # domain entities & value objects
│    ├── application/        # business use-cases (ComputeCB, Bank, Pool)
│    └── ports/              # input/output ports (interfaces)
├── adapters/
│    ├── inbound/http/       # Express controllers (inbound adapters)
│    └── outbound/postgres/  # Postgres repositories (outbound adapters)
├── infrastructure/
│    ├── db/                 # migrations + seeds
│    └── server/             # composition root
└── shared/                  # constants, helpers

frontend/src/
├── core/                    # domain models & types (no React)
├── adapters/
│    ├── ui/                 # React pages/components (inbound)
│    └── infrastructure/     # API client (outbound)
└── index.css / main.tsx     # entrypoint

````

📐 **Core** is framework-independent.  
💡 **Adapters** implement ports to connect core logic with frameworks.  
🚀 **Infrastructure** wires dependencies and executes the app.

---

## ⚙️ Backend Setup & Usage

### 🔧 1. Setup Environment
Copy `.env.example` to `.env` and configure:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/fueleu
PORT=3001
````

### 📦 2. Install Dependencies

```bash
cd backend
npm install
```

### 🗃️ 3. Run Database Migration & Seed

```bash
npm run migrate
npm run seed
```

### 🏁 4. Start the Server

```bash
npm run dev
```

Your backend now runs at 👉 **[http://localhost:3001](http://localhost:3001)**

### ⚡ Backend Scripts

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start development server        |
| `npm run migrate` | Run database migrations         |
| `npm run seed`    | Seed sample data                |
| `npm run test`    | Run unit & integration tests    |
| `npm run build`   | Build TypeScript for production |

---

## 💻 Frontend Setup & Usage

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Start the Development Server

```bash
npm run dev
```

Runs on 👉 **[http://localhost:5173](http://localhost:5173)**

> The Vite server proxies API calls to `http://localhost:3001`.

---

## 🔗 API Endpoints

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| `GET`  | `/routes`                             | List seeded routes              |
| `POST` | `/routes/:id/baseline`                | Set baseline route              |
| `GET`  | `/routes/comparison`                  | Compare baseline vs others      |
| `GET`  | `/compliance/cb?shipId&year`          | Compute CB snapshot             |
| `GET`  | `/compliance/adjusted-cb?shipId&year` | Adjusted CB (after banking)     |
| `GET`  | `/banking/records?shipId&year`        | Banking records                 |
| `POST` | `/banking/bank`                       | Bank surplus CB                 |
| `POST` | `/banking/apply`                      | Apply banked surplus            |
| `POST` | `/pools`                              | Pool ships and redistribute CBs |

🧮 **Formula Reference:**

```
Energy (MJ) = fuelConsumption × 41,000
Compliance Balance = (Target (89.3368) − Actual) × Energy
```

---

## 🧪 Testing

Backend includes **unit + integration** tests using Vitest:

| Test File            | Description                               |
| -------------------- | ----------------------------------------- |
| `computeCB.test.ts`  | Verifies compliance balance calculation   |
| `comparison.test.ts` | Checks baseline vs comparison routes      |
| `banking.test.ts`    | Validates banking/applying logic          |
| `pooling.test.ts`    | Validates pool redistribution             |
| `http.test.ts`       | Integration test using in-memory adapters |

Run tests:

```bash
cd backend
npm test
```

---

## 🖼️ UI Preview

### 🗺️ Routes Tab

Displays all seeded routes, allows filtering, and lets you set a baseline. <img src="docs/screenshots/Routes.png" alt="Routes Tab" width="750"/>

---

### 📊 Compare Tab

Shows baseline vs comparison data, with % difference and compliance indicators. <img src="docs/screenshots/Compare.png" alt="Compare Tab" width="750"/>

---

### 🏦 Banking Tab

Displays Compliance Balance (CB), allows banking surplus and applying it to deficit years. <img src="docs/screenshots/Banking.png" alt="Banking Tab" width="750"/>

---

### ⚖️ Pooling Tab

Implements pooling logic to redistribute CBs between ships. <img src="docs/screenshots/Pooling.png" alt="Pooling Tab" width="750"/>

---

## 🧾 Development Notes

* ✅ **TypeScript strict mode** enabled
* ✅ **Framework-agnostic core**
* ✅ **Clean separation of layers**
* ✅ **Postgres adapter** built using `pg`
* ✅ **Frontend UI** built with TailwindCSS + minimal components
* ✅ **AI Agent usage** documented in `AGENT_WORKFLOW.md`

---


## 🧠 About

Developed as part of the **FuelEU Maritime – FullStack Developer Assignment**, demonstrating:

* Clean architecture design
* Strong TypeScript modeling
* Real-world backend + frontend integration
* Proper AI-assisted documentation and testing

---

⭐ **Built with clarity, domain focus, and testability in mind.**

 
