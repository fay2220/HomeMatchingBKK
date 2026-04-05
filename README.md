# 🏡 HomeMatchingBKK & LifeFit Engine™

Welcome to **HomeMatchingBKK**, a cutting-edge, data-driven real estate matching platform tailored for Bangkok! Built around the **LifeFit Score Engine™**, this application analyzes over 200+ neighborhood health signals, lifestyle preferences, and multi-dimensional scoring logic to find the perfect property for users.

---

## ✨ Project Credits & Philosophy

This project was built using a **Vibecoding** philosophy—flowing from concept to code through collaboration with next-generation AI tools.

- 🎨 **Design & Prototyping:** Replit
- 📊 **Data & Architecture Research:** Gemini & ChatGPT
- 💻 **Engineering & Coding:** Antigravity (Google DeepMind)

---

## 🚀 Key Features

*   **LifeFit Score Engine™**: A hyper-personalized calculation engine evaluating properties across 5 core dimensions:
    - **Health (30%)**: PM2.5 levels, noise pollution, hospital proximity tailored to specific conditions.
    - **Budget & Commute (25%)**: Dynamic slider up to ฿200M and customized commute-time lookups across major Bangkok zones.
    - **Family (15%)**: Weighted scoring based on family archetypes (elderly vs. youth vs. infants) and required space per person (20 SQM/p).
    - **Pet (15%)**: Hard filters for pet-friendly properties + space bonuses for households with 3+ pets.
    - **Lifestyle (15%)**: Advanced cluster synergy & conflict mitigation (e.g., balancing Urban Life with Quiet Living).
*   **Location Penalty**: Strictly deduces scores if the property falls outside the user's preferred district.
*   **Dynamic Data**: Replaced static mockups with a robust PostgreSQL database mapping real properties in Bangkok.
*   **Stunning UI/UX**: Built with React, Vite, and Tailwind-inspired custom CSS featuring glassmorphism and modern gradient designs.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite) + TypeScript
- Wouter for routing
- Leaflet for interactive maps

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL (via Docker)

**Infrastructure:**
- Fully containerized with `docker-compose`

---

## 💻 Getting Started

This project is fully dockerized. To spin up the entire application (Frontend, Backend, and Database):

```bash
# 1. Start the containers in detached mode
docker-compose up -d --build

# 2. Sync the Prisma schema
docker exec homematching_backend npx prisma db push --accept-data-loss

# 3. Seed the database with the initial 10 properties
docker exec homematching_backend npx prisma db seed
```

Once running:
- **Frontend** is available at: `http://localhost:5173`
- **Backend API** is available at: `http://localhost:3000`
- **Postgres DB** runs internally on port `5432`

---

> *"Vibecoding the future of real estate matching."*
